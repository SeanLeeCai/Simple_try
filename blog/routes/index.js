
/*
 * GET home page.
 */
var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports=function(app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
        });
    });

    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回主册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        //检查用户名是否已经存在
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = user;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });
    });


    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/dosomething');//登陆成功后跳转到主页
        });
    });

    app.get('/post', function (req, res) {
        res.render('post', {title: '发表'});
    });
    app.post('/post', function (req, res) {

    });

    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');//登出成功后跳转到主页
    });

    app.get('/users', function (req, res) {
        User.get0(null, function (err, users) {
            if (err) {
                users = [];
            }
            res.render('users', {
                title: '查看所有已注册用户信息',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                users: users
            });
        });
    });


    app.get('/change_email', function (req, res) {
        res.render('change_email', {
            title: '修改邮箱',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/change_email', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/change_email');//用户不存在则跳转到修改邮箱页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/change_email');//密码错误则跳转到修改邮箱页
            }
            //用户名密码都匹配后，修改邮箱
            User.update(req.body.name, req.body.cmail, function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/change_email');//出错！返回修改邮箱页
                }
                req.flash('success', '修改成功!');
                res.redirect('/users');//登陆成功后跳转到已注册用户  查看
            });
        });
    });


    app.get('/delete', function (req, res) {
        res.render('delete', {
            title: '删除帐号',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/delete', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/delete');//用户不存在则跳转到删除页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/delete');//密码错误则跳转到删除页
            }
            //用户名密码都匹配后，修改邮箱
            User.delete(req.body.name, function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/delete');//出错！返回修改删除页
                }
                req.flash('success', '删除成功!');
                res.redirect('/users');//登陆成功后跳转到已注册用户  查看
            });
        });
    });


    app.get('/dosomething', function (req, res) {
        User.get0(req.session.user.name, function (err, users) {
            if (err) {
                users = [];
            }
            res.render('dosomething', {
                title: '做点啥来证明正确了？',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                num: users[0].num
            });
        });
    });

    app.post('/dosomething', function (req, res) {
        User.numadd(req.session.user.name, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/dosomething');//出错！返回
            }
            req.flash('success', '加一成功!');
            res.redirect('/dosomething');//成功后返回
        });
    });
}