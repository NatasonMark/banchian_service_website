*** นี้เป็น project เล็กๆที่ผมลองทำครั้งแรกเป็นการ vibecode ทั้งหมด ***
# 🌬️ Banchian Service -

## 📋 สารบัญ
1. [ไฟล์ที่มี](#ไฟล์ที่มี)
2. [การทำงานของระบบ](#การทำงานของระบบ)
3. [วิธีการใช้งาน](#วิธีการใช้งาน)
4. [คำสั่ง Console](#คำสั่ง-console)
5. [ขั้นตอนการตั้งค่า](#ขั้นตอนการตั้งค่า)

---

## ✅ ไฟล์ที่มี

```
banachiangservice/
├── index.html          ← เว็บไซต์หลัก
├── admin.html          ← แพนเนลจัดการคำสั่งซื้อ
├── styles.css          ← ตกแต่งทั้งเว็บไซต์
├── script.js           ← ฟังก์ชันทั้งเว็บไซต์
├── send-email.php      ← ส่งอีเมลยืนยัน (ต้องเซิร์ฟเวอร์)
├── images/             ← โฟลเดอร์เก็บรูปภาพ
└── README.md           ← ไฟล์นี้
```

---

## 🎯 การทำงานของระบบ

### 1️⃣ **เพิ่มสินค้าลงตะกร้า**
- ลูกค้ากด "เพิ่มลงตะกร้า" บนหน้าสินค้า
- ระบบบันทึกข้อมูลใน LocalStorage (เบราว์เซอร์)
- ตะกร้าอัปเดตทันที

### 2️⃣ **ดูตะกร้า**
- กดปุ่ม "🛒 ตะกร้า" ในเมนู
- Modal โปรแกรมแสดงสินค้าทั้งหมด
- สามารถปรับจำนวน (+/-) หรือลบสินค้า

### 3️⃣ **ชำระเงิน (Checkout)**
- กด "ดำเนินการชำระเงิน" ในตะกร้า
- กรอกข้อมูล: ชื่อ, อีเมล, เบอร์โทร, ที่อยู่
- เลือกวิธีชำระ: โอนธนาคาร, บัตรเครดิต, PromptPay
- ยืนยันการสั่งซื้อ

### 4️⃣ **ส่งอีเมล**
- ระบบส่งอีเมลยืนยันอัตโนมัติ (ถ้ามี Backend)
- บันทึกข้อมูลลงในฐานข้อมูล LocalStorage

### 5️⃣ **Admin Panel**
- เปิด `admin.html` เพื่อจัดการคำสั่งซื้อ
- ดูสถิติ: รวม, รอการชำระ, เสร็จสิ้น, รายได้

---

## 🚀 วิธีการใช้งาน

### **ขั้นที่ 1: เปิดเว็บไซต์**
```bash
# เปิด index.html ในเบราว์เซอร์ 
# หรือ ใช้ Python HTTP Server
cd banachiangservice
python -m http.server 8000
# แล้วเปิด http://localhost:8000
```

### **ขั้นที่ 2: ทดสอบการสั่งซื้อ**
1. เพิ่มสินค้า 2-3 รายการ
2. กดปุ่ม 🛒 ตะกร้า
3. กดปุ่ม "ดำเนินการชำระเงิน"
4. กรอกข้อมูลและยืนยัน
5. ตระหนัก "✓ สั่งซื้อสำเร็จ!"

### **ขั้นที่ 3: ดูคำสั่งในแพนเนลแอดมิน**
```bash
# เปิด admin.html
# http://localhost:8000/admin.html
```

---

## 💻 คำสั่ง Console

เปิด Console ด้วย `F12` หรือ `Ctrl+Shift+J` แล้วพิมพ์:

### **ดูตะกร้า**
```javascript
viewCart()
// แสดง: รายละเอียดสินค้า + รวมราคา
```

### **ดูข้อมูล JSON**
```javascript
cart
// แสดง: ข้อมูล array ของสินค้าในตะกร้า
```

### **ดูคำสั่งซื้อทั้งหมด**
```javascript
JSON.parse(localStorage.getItem('banchian-orders'))
// แสดง: ข้อมูลคำสั่งซื้อทั้งหมด
```

### **ล้างตะกร้า**
```javascript
clearCart()
```

### **เปิดตะกร้า**
```javascript
openCart()
```

### **ไปชำระเงิน**
```javascript
proceedToCheckout()
```

---

## 🔧 ขั้นตอนการตั้งค่า

### **✅ ขั้นที่ 1: เพิ่มรูปสินค้า**
```
1. สร้างโฟลเดอร์ "images"
2. ใส่รูปไฟล์: product1.jpg, product2.jpg เป็นต้น
3. เปลี่ยนใน HTML:
   <img src="images/product1.jpg" alt="..." class="product-img">
```

### **✅ ขั้นที่ 2: ตั้งค่าส่งอีเมล (ถ้ามี Server)**
```bash
# ติดตั้ง PHP ในเซิร์ฟเวอร์
# สำคัญ: แก้ไข send-email.php บรรทัดนี้:
$headers .= "From: your-email@example.com\r\n";
```

### **✅ ขั้นที่ 3: ตั้งค่าข้อมูลธนาคาร**
```html
<!-- ในไฟล์ index.html หรือ send-email.php แก้ไข:-->
ธนาคาร: ธนาคารของคุณ
ชื่อบัญชี: ชื่อของคุณ
เลขบัญชี: 123-456-7890
```

### **✅ ขั้นที่ 4: เชื่อม Database จริง (ไม่บังคับ)**

#### **ตัวเลือก A: ใช้ Firebase**
```javascript
// ใน script.js เพิ่ม:
firebase.database().ref('orders').push(order);
```

#### **ตัวเลือก B: ใช้ PHP + MySQL**
```php
// ใน save-order.php:
$sql = "INSERT INTO orders VALUES (...)";
mysqli_query($conn, $sql);
```

#### **ตัวเลือก C: ใช้ Node.js + MongoDB**
```javascript
app.post('/api/orders', (req, res) => {
  Order.create(req.body);
});
```

---

## 📊 ข้อมูลที่บันทึก

### **บันทึกตะกร้าใน LocalStorage**
```json
{
  "id": 1717123456789,
  "name": "เบนเชียน โปร X1",
  "price": 9990,
  "quantity": 2,
  "timestamp": "04/06/2026, 14:30:45"
}
```

### **บันทึกคำสั่งซื้อใน LocalStorage**
```json
{
  "orderId": "ORD-1717123456789",
  "customerName": "สมชาย เชียงใจ",
  "customerEmail": "somchai@email.com",
  "customerPhone": "0812345678",
  "customerAddress": "123 ม.1 ถ.เมนจรฺ กรุงเทพ",
  "paymentMethod": "bank",
  "items": [...],
  "total": 34970,
  "status": "pending",
  "createdAt": "04/06/2026, 14:30:45"
}
```

---

## 🔐 ความปลอดภัย

### ⚠️ **สำคัญ!**
- LocalStorage ไม่ปลอดภัยสำหรับข้อมูลสำคัญ
- **ต้องใช้ Backend + HTTPS + Database จริง**

### ✅ **การป้องกัน**
```javascript
// 1. ตรวจสอบข้อมูล (Validation)
if (!email.includes('@')) return false;

// 2. เข้ารหัสข้อมูล (Encryption)
const encrypted = btoa(JSON.stringify(data));

// 3. ใช้ HTTPS
// ตั้งค่าเฉพาะบนเซิร์ฟเวอร์จริง

// 4. ตรวจสอบสิทธิ์ (Authentication)
// ใช้ token หรือ session
```

---

## 🎨 ปรับแต่งเพิ่มเติม

### **เปลี่ยนสีหลัก**
```css
/* ใน styles.css เปลี่ยนบรรทัดนี้: */
--primary-color: #0099cc;     /* ฟ้า */
--secondary-color: #00d4ff;   /* ฟ้าอ่อน */
```

### **เปลี่ยนชื่อ**
```html
<!-- ที่ไหน "Banchian service" → แก้เป็นชื่อของคุณ -->
```

### **เปลี่ยนหมายเลขโทรศัพท์**
```html
<a href="tel:081-888-8888">081-888-8888</a>
<!-- เปลี่ยนเป็นเบอร์ของคุณ -->
```

---

## 📱 API Endpoints (ถ้ามี Backend)

### **POST /api/send-email**
```json
{
  "to": "customer@email.com",
  "orderDetails": { ... }
}
```

### **POST /api/orders**
```json
{
  "orderData": { ... }
}
```

### **GET /api/orders**
ดึงคำสั่งซื้อทั้งหมด

### **PUT /api/orders/:id**
อัปเดตสถานะคำสั่ง

---

## 🐛 แก้ไขปัญหาทั่วไป

### **❌ ตะกร้าหายหลังปิดเบราว์เซอร์**
✅ **แก้ไข:** LocalStorage ควรเก็บข้อมูลไว้ตั้งแต่ปิด แต่บางครั้งลบข้อมูลเองได้
```javascript
// ลองใช้:
localStorage.clear()  // ล้างหมด
// แล้วเริ่มใหม่
```

### **❌ อีเมลไม่ส่ง**
✅ **แก้ไข:** ต้องมี Server ที่รองรับ PHP
```bash
# ใช้ Local Server:
php -S localhost:8001
```

### **❌ รูปไม่แสดง**
✅ **แก้ไข:** ตรวจสอบ path รูป
```html
<!-- ถูก -->
<img src="images/product1.jpg">

<!-- ผิด -->
<img src="../images/product1.jpg">
```

---

## 📞 ติดต่อเรา

- 📧 Email: info@banchianservice.com
- 📱 Phone: 081-888-8888
- 🕐 เวลาทำการ: จ-ศ 9:00-18:00, ส-อ 10:00-16:00

---

**✨ ขอบคุณที่ใช้บริการ Banchian service!**
