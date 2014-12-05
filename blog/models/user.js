var mongodb = require('./db');
var crypto = require('crypto');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex');
        //head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    //要存入数据库的用户信息文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        //head: head,
        num:0
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
User.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};

User.get0=function(name,callback) {//用于读取已注册用户
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //根据query对象查询
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
}


User.update = function(name, new_email,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新邮箱
            collection.update({
                "name": name
            }, {
                $set:{"email": new_email}
                }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

User.delete = function(name,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //删除帐号
            collection.remove({
                "name": name
            }, {
                w: 1
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

User.numadd = function(name,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新邮箱
            collection.update({
                "name": name
            }, {
                $inc:{"num": 1}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};


