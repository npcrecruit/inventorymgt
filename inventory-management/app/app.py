from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from models import db, Item
from datetime import datetime
import logging
from models import db, Item, Category, Location, Supplier
from models import StockMovement, Alert, AuditLog
import json
from sqlalchemy import func
from datetime import datetime, timedelta
from flask_jwt_extended import (
    JWTManager, create_access_token, get_jwt_identity, 
    jwt_required, get_jwt
)
from models import User, UserPermission
from functools import wraps



# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)  # Remove static_folder and static_url_path for API-only server
    
    # Configure the Flask application
    base_dir = '/workspaces/inventorymgt/inventory-management'
    db_path = os.path.join(base_dir, 'inventory.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)
    
    return app

app = create_app()

# Initialize JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Role-based access control decorator
def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if user.role != required_role and user.role != 'admin':
                return jsonify({"error": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Root route returns current API info
@app.route('/')
def home():
    return jsonify({
        "status": "operational",
        "version": "1.0.0",
        "timestamp": "2025-01-05 05:44:16",  # Updated timestamp
        "user": "npcrecruit",
        "database": "SQLite",
        "message": "Inventory Management System API"
    })

# Update timestamp in statistics endpoint
@app.route('/api/statistics')
def get_statistics():
    try:
        total_items = Item.query.count()
        total_quantity = db.session.query(db.func.sum(Item.quantity)).scalar() or 0
        categories_count = db.session.query(Item.category, db.func.count(Item.id))\
            .group_by(Item.category).all()
        
        return jsonify({
            "total_items": total_items,
            "total_quantity": total_quantity,
            "categories_distribution": dict(categories_count),
            "timestamp": "2025-01-05 05:44:16",  # Updated timestamp
            "generated_by": "npcrecruit"
        })
    except Exception as e:
        logger.error(f"Error fetching statistics: {str(e)}")
        return jsonify({"error": "Failed to fetch statistics"}), 500


# Batch Operations
@app.route('/api/items/batch', methods=['POST'])
def batch_add_items():
    try:
        items = request.json.get('items', [])
        for item_data in items:
            new_item = Item(**item_data)
            db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Batch items added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/categories', methods=['GET', 'POST'])
def manage_categories():
    if request.method == 'GET':
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories])
    else:
        try:
            data = request.json
            category = Category(name=data['name'], description=data.get('description'))
            db.session.add(category)
            db.session.commit()
            return jsonify(category.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

@app.route('/api/locations', methods=['GET', 'POST'])
def manage_locations():
    if request.method == 'GET':
        locations = Location.query.all()
        return jsonify([location.to_dict() for location in locations])
    else:
        try:
            data = request.json
            location = Location(name=data['name'], description=data.get('description'))
            db.session.add(location)
            db.session.commit()
            return jsonify(location.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

@app.route('/api/suppliers', methods=['GET', 'POST'])
def manage_suppliers():
    if request.method == 'GET':
        suppliers = Supplier.query.all()
        return jsonify([supplier.to_dict() for supplier in suppliers])
    else:
        try:
            data = request.json
            supplier = Supplier(name=data['name'], contact_info=data.get('contact_info'))
            db.session.add(supplier)
            db.session.commit()
            return jsonify(supplier.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

# Dashboard & Analytics
@app.route('/api/dashboard/summary')
def dashboard_summary():
    try:
        current_time = datetime.utcnow()
        
        # Get total inventory value
        inventory_value = db.session.query(
            func.sum(Item.quantity * Item.unit_price)
        ).scalar() or 0

        # Get low stock items
        low_stock_items = Item.query.filter(
            Item.quantity <= Item.minimum_stock
        ).count()

        # Get items movement for last 7 days
        week_ago = current_time - timedelta(days=7)
        movements = StockMovement.query.filter(
            StockMovement.timestamp >= week_ago
        ).count()

        # Get active alerts
        active_alerts = Alert.query.filter_by(status='active').count()

        return jsonify({
            'timestamp': "2025-01-05 06:18:51",
            'total_inventory_value': round(inventory_value, 2),
            'low_stock_items': low_stock_items,
            'weekly_movements': movements,
            'active_alerts': active_alerts
        })
    except Exception as e:
        logger.error(f"Dashboard error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Stock Movement Tracking
@app.route('/api/stock/movement', methods=['POST'])
def record_stock_movement():
    try:
        data = request.json
        movement = StockMovement(
            item_id=data['item_id'],
            quantity_changed=data['quantity_changed'],
            movement_type=data['movement_type'],
            reason=data.get('reason'),
            created_by="npcrecruit"
        )
        
        # Update item quantity
        item = Item.query.get_or_404(data['item_id'])
        if movement.movement_type == 'in':
            item.quantity += movement.quantity_changed
        else:
            item.quantity -= movement.quantity_changed
        
        db.session.add(movement)
        db.session.commit()
        
        # Check for alerts
        check_stock_alerts(item)
        
        return jsonify(movement.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Authentication routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            if not user.is_active:
                return jsonify({"error": "Account is deactivated"}), 401
                
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            access_token = create_access_token(identity=user.id)
            return jsonify({
                "token": access_token,
                "user": user.to_dict()
            })
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/users', methods=['GET'])
@role_required('admin')
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users', methods=['POST'])
@role_required('admin')
def create_user():
    try:
        data = request.json
        user = User(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'user'),
            created_by="npcrecruit"
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create default permissions
        default_permissions = UserPermission(
            user_id=user.id,
            resource='items',
            can_view=True,
            can_create=user.role in ['admin', 'manager'],
            can_edit=user.role in ['admin', 'manager'],
            can_delete=user.role == 'admin'
        )
        db.session.add(default_permissions)
        db.session.commit()
        
        return jsonify(user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Enhanced Search & Filtering
@app.route('/api/search')
@jwt_required()
def search():
    try:
        query = request.args.get('q', '')
        category = request.args.get('category')
        location = request.args.get('location')
        min_quantity = request.args.get('min_quantity', type=int)
        max_quantity = request.args.get('max_quantity', type=int)
        supplier = request.args.get('supplier')
        sort_by = request.args.get('sort_by', 'name')
        order = request.args.get('order', 'asc')
        
        # Base query
        item_query = Item.query
        
        # Apply filters
        if query:
            item_query = item_query.filter(
                (Item.name.ilike(f'%{query}%')) |
                (Item.sku.ilike(f'%{query}%')) |
                (Item.description.ilike(f'%{query}%'))
            )
        
        if category:
            item_query = item_query.filter(Item.category == category)
        if location:
            item_query = item_query.filter(Item.location == location)
        if min_quantity is not None:
            item_query = item_query.filter(Item.quantity >= min_quantity)
        if max_quantity is not None:
            item_query = item_query.filter(Item.quantity <= max_quantity)
        if supplier:
            item_query = item_query.filter(Item.supplier_id == supplier)
            
        # Apply sorting
        sort_column = getattr(Item, sort_by)
        if order == 'desc':
            sort_column = sort_column.desc()
        item_query = item_query.order_by(sort_column)
        
        # Execute query
        items = item_query.all()
        
        return jsonify({
            "timestamp": "2025-01-05 06:27:03",
            "total": len(items),
            "items": [item.to_dict() for item in items]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Export data
@app.route('/api/export')
@jwt_required()
def export_data():
    try:
        format_type = request.args.get('format', 'json')
        resource = request.args.get('resource', 'items')
        
        if resource == 'items':
            data = [item.to_dict() for item in Item.query.all()]
        elif resource == 'stock_movements':
            data = [movement.to_dict() for movement in StockMovement.query.all()]
        elif resource == 'alerts':
            data = [alert.to_dict() for alert in Alert.query.all()]
        else:
            return jsonify({"error": "Invalid resource type"}), 400
            
        if format_type == 'json':
            return jsonify({
                "timestamp": "2025-01-05 06:27:03",
                "type": resource,
                "data": data
            })
        else:
            return jsonify({"error": "Unsupported format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Alert Management
@app.route('/api/alerts')
def get_alerts():
    status = request.args.get('status', 'active')
    alerts = Alert.query.filter_by(status=status).all()
    return jsonify([alert.to_dict() for alert in alerts])

@app.route('/api/alerts/<int:alert_id>', methods=['PUT'])
def update_alert(alert_id):
    try:
        alert = Alert.query.get_or_404(alert_id)
        data = request.json
        
        if 'status' in data:
            alert.status = data['status']
            if data['status'] == 'resolved':
                alert.resolved_at = datetime.utcnow()
                alert.resolved_by = "npcrecruit"
        
        db.session.commit()
        return jsonify(alert.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Audit Log
@app.route('/api/audit-logs')
def get_audit_logs():
    days = request.args.get('days', 7, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    logs = AuditLog.query.filter(
        AuditLog.timestamp >= start_date
    ).order_by(AuditLog.timestamp.desc()).all()
    
    return jsonify([log.to_dict() for log in logs])

# Helper function for stock alerts
def check_stock_alerts(item):
    if item.quantity <= item.minimum_stock:
        alert = Alert(
            item_id=item.id,
            alert_type='low_stock',
            message=f'Low stock alert for {item.name}. Current quantity: {item.quantity}',
            status='active'
        )
        db.session.add(alert)
    
    if item.quantity >= item.maximum_stock:
        alert = Alert(
            item_id=item.id,
            alert_type='overstock',
            message=f'Overstock alert for {item.name}. Current quantity: {item.quantity}',
            status='active'
        )
        db.session.add(alert)
    
    if item.expiration_date and item.expiration_date <= datetime.utcnow() + timedelta(days=30):
        alert = Alert(
            item_id=item.id,
            alert_type='expiring',
            message=f'Expiration alert for {item.name}. Expires on: {item.expiration_date.date()}',
            status='active'
        )
        db.session.add(alert)
    
    db.session.commit()

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        "error": "Resource not found",
        "timestamp": "2025-01-05 06:11:11",
        "path": request.path
    }), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        "error": "Internal server error",
        "timestamp": "2025-01-05 06:11:11"
    }), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(host='0.0.0.0', port=5000, debug=True)