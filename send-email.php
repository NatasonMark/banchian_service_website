<?php
// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// รับข้อมูล JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// ตรวจสอบข้อมูล
if (!isset($data['to']) || !isset($data['orderDetails'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$to = $data['to'];
$order = $data['orderDetails'];

// สร้างอีเมล
$subject = "ยืนยันคำสั่งซื้อ " . $order['orderId'] . " จาก Banchian Service";

$itemsHtml = '';
foreach ($order['items'] as $item) {
    $itemTotal = $item['price'] * $item['quantity'];
    $itemsHtml .= "<tr>
        <td style='padding: 10px; border-bottom: 1px solid #ddd;'>{$item['name']}</td>
        <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{$item['quantity']}</td>
        <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>฿" . number_format($item['price'], 2, '.', ',') . "</td>
        <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>฿" . number_format($itemTotal, 2, '.', ',') . "</td>
    </tr>";
}

$htmlMessage = "
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Arial', sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #0099cc, #00d4ff); color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 20px; margin: 20px 0; border-radius: 10px; }
        .order-info { background: #f0f8ff; padding: 15px; border-left: 4px solid #0099cc; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        table th { background: #f5f5f7; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
        .total-row { background: #f9f9f9; font-weight: bold; font-size: 18px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌬️ Banchian Service</h1>
            <p>ยืนยันคำสั่งซื้อ</p>
        </div>

        <div class='content'>
            <h2>สวัสดี " . htmlspecialchars($order['customerName']) . ",</h2>

            <p>ขอบคุณที่สั่งซื้อจาก Banchian Service! 🎉</p>

            <div class='order-info'>
                <p><strong>หมายเลขคำสั่ง:</strong> " . $order['orderId'] . "</p>
                <p><strong>วันที่:</strong> " . $order['createdAt'] . "</p>
                <p><strong>สถานะ:</strong> ✓ รอการชำระเงิน</p>
            </div>

            <h3>📦 รายละเอียดสินค้า</h3>
            <table>
                <tr>
                    <th>สินค้า</th>
                    <th style='text-align: center;'>จำนวน</th>
                    <th style='text-align: right;'>ราคาต่อหน่วย</th>
                    <th style='text-align: right;'>รวม</th>
                </tr>
                $itemsHtml
                <tr class='total-row'>
                    <td colspan='3' style='text-align: right; padding: 15px;'>รวมทั้งหมด:</td>
                    <td style='text-align: right; padding: 15px;'>฿" . number_format($order['total'], 2, '.', ',') . "</td>
                </tr>
            </table>

            <h3>👤 ข้อมูลการส่งมอบ</h3>
            <p>
                <strong>ชื่อ:</strong> " . htmlspecialchars($order['customerName']) . "<br>
                <strong>เบอร์โทร:</strong> " . htmlspecialchars($order['customerPhone']) . "<br>
                <strong>ที่อยู่:</strong> " . nl2br(htmlspecialchars($order['customerAddress'])) . "
            </p>

            <h3>💳 วิธีชำระเงิน</h3>
            <p>";

            if ($order['paymentMethod'] === 'bank') {
                $htmlMessage .= "
                    <strong>โอนเงินธนาคาร</strong><br>
                    ธนาคาร: ธนาคารกรุงเทพ<br>
                    ชื่อบัญชี: Banchian Service<br>
                    เลขบัญชี: 123-456-7890<br>
                    <span style='color: #FF6B6B;'>⏰ โปรดโอนเงินภายใน 24 ชั่วโมง</span>
                ";
            } elseif ($order['paymentMethod'] === 'promptpay') {
                $htmlMessage .= "<strong>PromptPay:</strong> 0812345678<br>จำนวนเงิน: ฿" . number_format($order['total'], 2, '.', ',');
            } else {
                $htmlMessage .= "<strong>บัตรเครดิต</strong><br>เรากำลังเตรียมการ...";
            }

            $htmlMessage .= "</p>

            <div class='order-info'>
                <p>📧 <strong>ตรวจสอบสถานะ:</strong> คุณสามารถติดตามสถานะคำสั่งซื้อได้ที่เมนู 'ตะกร้า' บนเว็บไซต์</p>
                <p>📞 <strong>ติดต่อเรา:</strong> 081-888-8888 หรือ info@banchianservice.com</p>
            </div>

            <p>ขอบคุณที่ไว้วางใจ Banchian Service! 🙏</p>
        </div>

        <div class='footer'>
            <p>&copy; 2026 Banchian Service | บริษัทเสถียร จำกัด</p>
            <p>อีเมลนี้ส่งมาจากระบบอัตโนมัติ กรุณาไม่ตอบกลับ</p>
        </div>
    </div>
</body>
</html>
";

// ส่งอีเมล
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: noreply@banchianservice.com\r\n";
$headers .= "Reply-To: info@banchianservice.com\r\n";

$success = mail($to, $subject, $htmlMessage, $headers);

// Response
if ($success) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'อีเมลส่งสำเร็จ',
        'orderId' => $order['orderId']
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'เกิดข้อผิดพลาดในการส่งอีเมล'
    ]);
}
?>
