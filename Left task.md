# E-Commerce Project Pending Tasks

## Admin Side

### 1. Order Controller with Status
- Replace `OrderItem` controller with a consolidated `Order` controller.  
- Manage status: **pending, shipped, delivered, cancelled**.  

### 2. Product Average Rating
- Implement logic to calculate and display **average rating** from reviews in `Product`.  

### 3. Admin Portal UIs
- **Category Management** → CRUD (form + table).  
- **Product Management** → CRUD (form + table).  
- **Settings UI** → Password & user info change.  

### 4. Review Management
- Backend + UI for reviews (`id, productId, userId, rating, comment`).  

### 5. Payments Admin Control
- Add **Payment schema** with status: *initiated, success, failed, refunded*.  
- Admin can manually update payment status.    also paid AT if COD

### 6. Consistency in Forms
- Apply design system:  
  - `w-[1280px] mx-auto`  
  - Consistent fonts  
  - Governance-style form design  

payment table, order table, with status
---

## User Side

### 1. Cart Management Enhancements
- Checkbox selection for cart items.  
- Summary calculation.  
- Quantity validation when adding to cart.  

### 2. Checkout Page
- Display selected items + order summary.  
- Choose payment method (**Khalti / COD**).  

### 3. Payment Flow
- Integrate **Khalti initiate API** (same as xcommerce).  
- Build `paymentPayload` and `orderPayload`.  
- When order is placed → **decrease stock + create payment record**.  

### 4. Order Detail Page
- Show order details with option to **download invoice**.  

### 5. Single Product Page
- Dedicated product view.  
- Show reviews.  
- Add-to-cart functionality.  
