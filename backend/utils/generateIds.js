const generateReceiptNo = () => "RC-" + Date.now() + Math.random().toString(36).substr(2, 9)
const generateOrderNo = () => "DO-" + Date.now() + Math.random().toString(36).substr(2, 9)
const generateTransferNo = () => "TR-" + Date.now() + Math.random().toString(36).substr(2, 9)
const generateAdjustmentNo = () => "ADJ-" + Date.now() + Math.random().toString(36).substr(2, 9)

module.exports = {
  generateReceiptNo,
  generateOrderNo,
  generateTransferNo,
  generateAdjustmentNo,
}
