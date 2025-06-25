# 🍔 Fast Food Project

A web project for a fast food restaurant developed using Next.js, utilizing different rendering strategies for various pages.

🔗 [View Live Project](https://amirfast.ir)

---

## ✨ Main Pages


### 1. Menu Page
- **Rendering Type:** Client Side Rendering (CSR)
- Display list of food items and user-customized items

### 2. FAQ Page
- **Rendering Type:** Incremental Static Regeneration (ISR)
- Revalidation only via API:
  ```ts
  revalidatePath("/faq")
  ```

### 3. Blog Page

* **Rendering Type:** Server Side Rendering (SSR)
* Admin-written content using TinyMCE

### 4. Checkout Page
- **Rendering Type:** Client Side Rendering (CSR)
- Display cart items
- Option to add order notes
- Select delivery address
- Add new address on the same page
- Choose payment method (Online/Cash on Delivery)

---

## 👥 User System

### Account Creation

* Enter email, unique username and password
* Receive verification code via email
* Account activation with verification code
* Automatic generation of **6-digit referral code**

### Login

* Login with email and password

---

## 🙋‍♂️ User Panel

### Account Information

* Edit:

  * First name
  * Last name
  * Phone number
  * Birth date
  * Change password
* ⚠️ Username and referral number cannot be changed

### Address Management

* Add, edit and delete addresses
* Set default address (for orders)

### Customized Burgers

* Create custom items by user
* Calculate and display **calorie count**
* Delete created items
* Add to menu and order

### Order History

* View previous orders
* Display order status:

  * Pending
  * Preparing
  * Shipping
  * Delivered
  * Cancled

---

## 🧑‍🍳 Admin Panel

### 🧾 Menu Management

* Add, delete and edit items with specifications:

  * Name
  * Price
  * Category
  * Calories
  * Image
  * Description
  * Status (Available/Unavailable)
* **Unavailable** items cannot be ordered by users.

### 📦 Order Management

* View order list
* Order operations:

  * Approve or reject orders
  * Record rejection reason
  * Change order status:

    * Preparing
    * Shipping
    * Delivered

### 👥 User Management

* View complete user list with all information
* Capabilities:

  * Promote user to **admin**
  * Remove admin privileges from users
  * Deactivate account
  * Reactivate deactivated accounts

### 🍳 Kitchen Page

* Display **confirmed** orders
* Show complete order details
* For customized burgers:

  * Display exact burger components in order
  * Goal: Accurate burger preparation by kitchen team

### ❓ FAQ Management

* Capabilities:

  * Add
  * Delete
  * Edit questions and answers
* When changing or adding questions:

  * Orange button appears (indicating unconfirmed changes)
  * "Confirm Changes" button = **Revalidate FAQ Page**

### 📰 Blog Management

* Add, delete, edit blogs
* Using powerful [TinyMCE](https://www.tiny.cloud/) editor with all features
* Option to add title image for each blog

### 📝 Manual Order Registration

For in-person or phone customers:

#### In-Person

* Register order without address
* Order sent directly to kitchen page
* No order confirmation needed

#### Phone Orders

* Search user by:

  * First and last name
  * Referral number
  * Email
  * Phone number
* Select user address (default address selected automatically)
* Option to add **notes** to order

---

## � Technologies and Libraries

| Tool               | Description              |
| ------------------ | ------------------------ |
| **Next.js 15**     | Main framework           |
| **React 19**      | UI library               |
| **TypeScript**     | Type-safe language       |
| **Supabase**       | Database & auth          |
| **TinyMCE**        | Blog editor              |
| **Three.js**       | 3D burger creation       |
| **Zustand**        | State management         |
| **Zod**            | Form validation          |
| **SweetAlert2**    | User confirmation dialogs|
| **React Toastify** | Notifications            |
| **jose**           | JWT Token creation/verification |
| **Vercel**         | Project deployment       |

---

## 🚀 Deployment

Project deployed on [Vercel](https://vercel.com/) and available at:

🔗 [https://amirfast.ir](https://amirfast.ir)

---

## 📂 Important Paths

* `/menu` — Menu page (CSR)
* `/faq` — FAQ (ISR + API-based Revalidation)
* `/blog` — Blogs (SSR)
* `/profile` — User panel
* `/admin` — Admin panel (completed)
* `/login` — Login or SignUp Page