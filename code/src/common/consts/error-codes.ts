export enum ErrorCode {
  // 通用错误
  SUCCESS = 0, // 操作成功
  FAILURE = 1, // 操作失败
  VALIDATION_FAILED = 10001, // 参数验证失败
  UNAUTHORIZED = 10002, // 认证失败或未认证
  FORBIDDEN = 10003, // 权限不足
  NOT_FOUND = 10004, // 资源未找到
  METHOD_NOT_ALLOWED = 10005, // 不允许的方法
  CONFLICT = 10006, // 资源冲突，例如重复数据
  PAYLOAD_TOO_LARGE = 10007, // 请求体过大
  UNSUPPORTED_MEDIA_TYPE = 10008, // 不支持的媒体类型
  RATE_LIMITED = 10009, // 请求过于频繁
  SERVER_ERROR = 10010, // 服务器内部错误

  // 用户相关错误
  USER_NOT_FOUND = 20001, // 用户未找到
  USER_ALREADY_EXISTS = 20002, // 用户已存在
  USER_PASSWORD_WRONG = 20003, // 用户密码错误
  USER_ACCOUNT_LOCKED = 20004, // 用户账户被锁定
  USER_TOKEN_EXPIRED = 20005, // 用户令牌过期
  USER_SESSION_EXPIRED = 20006, // 用户会话过期

  // 业务相关错误
  ORDER_NOT_FOUND = 30001, // 订单未找到
  ORDER_ALREADY_PAID = 30002, // 订单已支付
  INVENTORY_SHORTAGE = 30003, // 库存不足
  PAYMENT_FAILED = 30004, // 支付失败

  // 系统相关错误
  CONFIGURATION_ERROR = 40001, // 系统配置错误
  NETWORK_ERROR = 40002, // 网络错误
  DATABASE_ERROR = 40003, // 数据库错误
  EXTERNAL_SERVICE_ERROR = 40004, // 外部服务错误

  // 其他自定义错误
  CUSTOM_ERROR = 50001, // 自定义错误
}
