const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/login', createProxyMiddleware({
            target: 'http://192.168.82.215/',
            changeOrigin: true,
            pathRewrite: {
                '^/login': "/webNerve/modules/system/login.php?action=submit"
            }
        })
    );

    app.use(
        '/interface/asynRead.php', createProxyMiddleware({
            target: 'http://192.168.82.215/',
            changeOrigin: true,
            pathRewrite: {
                '^/interface': "/webNerve/modules/itservice/CostsAnalytics/qianlei/OperationApprovalSystem/interface/"
            }
        })
    );

    app.use(
        '/interface/asynRead_reg_headphone.php', createProxyMiddleware({
            target: 'http://192.168.82.215/',
            changeOrigin: true,
            pathRewrite: {
                '^/interface': "/webNerve/modules/itservice/CostsAnalytics/qianlei/OperationApprovalSystem/interface/"
            }
        })
    );

    app.use(
        '/interface/asynRead_operate_computer.php', createProxyMiddleware({
            target: 'http://192.168.82.215/',
            changeOrigin: true,
            pathRewrite: {
                '^/interface': "/webNerve/modules/itservice/CostsAnalytics/qianlei/OperationApprovalSystem/interface/"
            }
        })
    )

}