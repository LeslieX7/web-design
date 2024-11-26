import json
from flask_sqlalchemy import SQLAlchemy
from app import app

# 更新为远程数据库连接的配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://XUL3227:4C1LW181@wayne.cs.uwec.edu:3306/cs485group4'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 测试数据库连接
try:
    with db.engine.connect() as connection:
        print("Successfully connected to the remote database: cs485group4")
except Exception as e:
    print(f"Error connecting to the database: {e}")


class Bathroom(db.Model):
    __tablename__ = 'bathroom'
    room_id = db.Column(db.Integer, primary_key=True)
    home_id = db.Column(db.Integer, nullable=False)

class Bedroom(db.Model):
    __tablename__ = 'bedroom'
    room_id = db.Column(db.Integer, primary_key=True)
    home_id = db.Column(db.Integer, nullable=False)

class Device(db.Model):
    __tablename__ = 'device'
    device_id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer)
    device_type_id = db.Column(db.Integer)
    status = db.Column(db.String(10), nullable=False, default='Off')
    brightness = db.Column(db.Integer)
    temperature = db.Column(db.Integer)
    position = db.Column(db.Integer)
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    setting = db.Column(db.JSON)
    user_id = db.Column(db.Integer)

    def to_json(self):
        json_data = json.dumps({
            "device_id": self.device_id,
            "room_id": self.room_id,
            "device_type_id": self.device_type_id,
            "status": self.status,
            "brightness": self.brightness,
            "temperature": self.temperature,
            "position": self.position,
            "updated_at": str(self.updated_at),
            "setting": self.setting
        })
        return json_data



class DeviceLogs(db.Model):
    __tablename__ = 'device_logs'
    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    device_id = db.Column(db.Integer)
    action_taken = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class DeviceType(db.Model):
    __tablename__ = 'device_type'
    device_type_id = db.Column(db.Integer, primary_key=True)
    device_name = db.Column(db.String(100), nullable=False)

class Home(db.Model):
    __tablename__ = 'home'
    home_id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer)

class Kitchen(db.Model):
    __tablename__ = 'kitchen'
    room_id = db.Column(db.Integer, primary_key=True)
    home_id = db.Column(db.Integer, nullable=False)

class LivingRoom(db.Model):
    __tablename__ = 'living_room'
    room_id = db.Column(db.Integer, primary_key=True)
    home_id = db.Column(db.Integer, nullable=False)

class Rooms(db.Model):
    __tablename__ = 'rooms'
    room_id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer)

class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    home_address = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    family_members = db.Column(db.Integer, nullable=False)
    reset_token = db.Column(db.String(255))
    reset_expires = db.Column(db.DateTime)