from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy instance
db = SQLAlchemy()

class Item(db.Model):
    # Existing fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    
    # New fields
    description = db.Column(db.Text)
    minimum_stock = db.Column(db.Integer, default=0)
    maximum_stock = db.Column(db.Integer)
    reorder_point = db.Column(db.Integer)
    unit_price = db.Column(db.Float)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'))
    barcode = db.Column(db.String(100))
    expiration_date = db.Column(db.DateTime)
    last_restock_date = db.Column(db.DateTime)
    
    # Audit fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50))
    updated_by = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'sku': self.sku,
            'category': self.category,
            'location': self.location,
            'description': self.description,
            'minimum_stock': self.minimum_stock,
            'maximum_stock': self.maximum_stock,
            'reorder_point': self.reorder_point,
            'unit_price': self.unit_price,
            'supplier_id': self.supplier_id,
            'barcode': self.barcode,
            'expiration_date': self.expiration_date.isoformat() if self.expiration_date else None,
            'last_restock_date': self.last_restock_date.isoformat() if self.last_restock_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by': self.created_by,
            'updated_by': self.updated_by
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    items = db.relationship('Item', backref='category_rel', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    items = db.relationship('Item', backref='location_rel', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.Text)
    items = db.relationship('Item', backref='supplier_rel', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_info': self.contact_info
        }
# models.py - Add these new models

class StockMovement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity_changed = db.Column(db.Integer, nullable=False)
    movement_type = db.Column(db.String(20), nullable=False)  # 'in' or 'out'
    reason = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'quantity_changed': self.quantity_changed,
            'movement_type': self.movement_type,
            'reason': self.reason,
            'timestamp': self.timestamp.isoformat(),
            'created_by': self.created_by
        }

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)  # 'low_stock', 'expiring', 'overstock'
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='active')  # 'active', 'resolved', 'ignored'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    resolved_by = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'alert_type': self.alert_type,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'resolved_by': self.resolved_by
        }

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)
    table_name = db.Column(db.String(50), nullable=False)
    record_id = db.Column(db.Integer)
    changes = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'table_name': self.table_name,
            'record_id': self.record_id,
            'changes': self.changes,
            'timestamp': self.timestamp.isoformat(),
            'user': self.user
        }

# models.py - Add User Management models

from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    role = db.Column(db.String(20), default='user')  # 'admin', 'manager', 'user'
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(50))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat(),
            'created_by': self.created_by
        }

class UserPermission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resource = db.Column(db.String(50), nullable=False)  # 'items', 'categories', 'locations', 'suppliers'
    can_view = db.Column(db.Boolean, default=True)
    can_create = db.Column(db.Boolean, default=False)
    can_edit = db.Column(db.Boolean, default=False)
    can_delete = db.Column(db.Boolean, default=False)