# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://github-personal/Temkum/sparrowcakes-cms/compare/v1.3.0...v1.7.0) (2025-05-10)


### Features

* implement reviews management feature with CRUD operations ([adbfe63](https://github-personal/Temkum/sparrowcakes-cms/commit/adbfe6337ba830202fda4481ed1d5008c1fcdcf3))


### Bug Fixes

* fix issues with reviews from database ([c725352](https://github-personal/Temkum/sparrowcakes-cms/commit/c7253524c0243a3bc0a2c29ffe847f8cf233a53b))
* fix review update and products, customers dropdown bug ([066f0c3](https://github-personal/Temkum/sparrowcakes-cms/commit/066f0c315ae068156539fb33d412d76cf682fcd7))

## [1.6.0](https://github.com/Temkum/sparrowcakes-cms/compare/v1.3.0...v1.6.0) (2025-04-25)


### Features

* add customer selection and export functionality in Customers component ([b0f6cfe](https://github.com/Temkum/sparrowcakes-cms/commit/b0f6cfef16ad7b05ce6938de5cf1dc54a78fa149))
* add delete functionality for selected customers; implement deleteCustomers method in customerService and integrate it into Customers component with user feedback ([42c6afb](https://github.com/Temkum/sparrowcakes-cms/commit/42c6afb5fa0fccff6aa9d78aced3dd7e3b8a910c))
* enhance customer form validation; add character limits for name, city, address, and occupation fields; improve phone number validation; integrate Toaster for notifications in CreateCustomerModal ([70ff98e](https://github.com/Temkum/sparrowcakes-cms/commit/70ff98e00d73b3882b25fcf48c5b27d5f5d53cfd))
* enhance error handling in LoginForm and RegisterForm; improve user feedback on registration and login failures ([1252f1e](https://github.com/Temkum/sparrowcakes-cms/commit/1252f1e0d3014aab64cc961c1ef9b29dbb618523))
* implement customer edit functionality; reset form fields based on mode and customer data in CreateCustomerModal; update customer service to use PATCH method for updates ([e9c1d69](https://github.com/Temkum/sparrowcakes-cms/commit/e9c1d695745562a2384648123e269a84f5cb8fbf))
* implement customer management features; add customer service, store, and update form handling ([6db6738](https://github.com/Temkum/sparrowcakes-cms/commit/6db6738dde8a1295c1d0eb84e86ad4baeaa03fed))
* implement useDebounce hook and integrate it into Customers component for improved search functionality; enhance customer service with pagination and filtering support ([ed40f9d](https://github.com/Temkum/sparrowcakes-cms/commit/ed40f9dcfed75464189254cf357833d142e7c743))
* improve delete confirmation handling in ProductsTable; use selectedForDeleteId for dialog state ([3e7cb39](https://github.com/Temkum/sparrowcakes-cms/commit/3e7cb39f1d46d1e961c1dd6d850bfb80b96d3c9f))
* improve login functionality; simplify email validation message in LoginSchema and remove console logs from auth service ([af2e2f7](https://github.com/Temkum/sparrowcakes-cms/commit/af2e2f7044f7aba625e77ecddb74e804b35c5db8))
* update customer loading logic and enhance customer export data; include email and occupation in CSV export, and adjust useEffect dependencies for loading customers ([708831f](https://github.com/Temkum/sparrowcakes-cms/commit/708831fe6d5db952de2244ea2686ae77d848b18b))

## [1.5.0](https://github.com/Temkum/sparrowcakes-cms/compare/v1.4.0...v1.5.0) (2025-04-23)


### Features

* Add category and product form schemas using Zod for validation ([8e5d223](https://github.com/Temkum/sparrowcakes-cms/commit/8e5d2230be30a1eecd81d0e6006b91181c6d317f))
* enhance axios instance with token management and improved error handling ([ffe9bfa](https://github.com/Temkum/sparrowcakes-cms/commit/ffe9bfab16389c695c71e61ccc316db80e62110b))
* Enhance product deletion functionality; add token authorization for delete requests, improve error handling, and implement bulk delete with fallback to individual deletes ([de5fff3](https://github.com/Temkum/sparrowcakes-cms/commit/de5fff323808be2860b074562cb94d86d0356482))
* Enhance product details display; sanitize description HTML and improve button hover state ([d73dbf6](https://github.com/Temkum/sparrowcakes-cms/commit/d73dbf6184d0c187977ff0c8a68c05525132ce83))
* Enhance product form and service error handling; improve validation error management and user feedback ([956893a](https://github.com/Temkum/sparrowcakes-cms/commit/956893a4dd4b5813fb53151c9f4c18242ead4708))
* Enhance product management features; implement product details view, improve product form handling, and update product service for better data fetching ([29d5a13](https://github.com/Temkum/sparrowcakes-cms/commit/29d5a13603f82735bacc8057a7dd895b09c38c05))
* Implement DynamicCategories and Editor components; enhance ImageUpload and ProductForm with Zustand store integration ([7bac025](https://github.com/Temkum/sparrowcakes-cms/commit/7bac0252c8973fe0cb630e0786d61f90b711c3ae))
* Implement product editing functionality; add ProductEdit component, update routing, and enhance product form handling for editing existing products ([8d80aa0](https://github.com/Temkum/sparrowcakes-cms/commit/8d80aa0481b2db1c9f922bd4edf77ab88e0b333f))
* refactor authentication logic to use Zustand store; replace axios with axiosInstance for API calls ([deecc49](https://github.com/Temkum/sparrowcakes-cms/commit/deecc4920416d4e400835bb920c29b254ddb84e9))
* refactor Editor component to use forwardRef and enhance props; update imports in related files ([ac377fb](https://github.com/Temkum/sparrowcakes-cms/commit/ac377fbe6f6d787da8f78665e71b27d09e83da83))
* Refactor product details handling; update image property names, enhance product API response structure, and improve error handling in product loading ([6dc0174](https://github.com/Temkum/sparrowcakes-cms/commit/6dc017422ee506be139fd063b5c7d4208b1206bb))
* Refactor product form and dynamic categories; update image upload component with previews and disable state ([f3e410e](https://github.com/Temkum/sparrowcakes-cms/commit/f3e410ec2d2aa76fa7f58b2495a0b2934cd26358))
* Update AddProduct and ProductForm components; implement success navigation and enhance form submission handling ([5124848](https://github.com/Temkum/sparrowcakes-cms/commit/51248489ecd9ea307bf06dbc27263d50e391d3e7))
* update CategoriesTable to use axiosInstance for API calls and improve error handling ([578b5b7](https://github.com/Temkum/sparrowcakes-cms/commit/578b5b73265e32eb5bcc713d86312e0f83d63ea8))
* Update product form and schema to support multiple categories and quantity; enhance dynamic category selection and form submission handling ([8a78d61](https://github.com/Temkum/sparrowcakes-cms/commit/8a78d61f7daa17f39b735cd279162145495819fa))
* Update ProductsTable and product types; rename image property for consistency and enhance selection handling ([ebe4954](https://github.com/Temkum/sparrowcakes-cms/commit/ebe49546a1f24ba99ccd2c738fbd89977993d843))

## [1.4.0](https://github.com/Temkum/sparrowcakes-cms/compare/v1.3.0...v1.4.0) (2025-04-05)


### Features

* add axios instance with authentication and token handling ([9376c41](https://github.com/Temkum/sparrowcakes-cms/commit/9376c41c2e593c992379855aed761c7ac13356fc))
* add DOMPurify for sanitizing category descriptions in CategoriesTable ([9308868](https://github.com/Temkum/sparrowcakes-cms/commit/9308868a451fa948d8ce980cc67aeb6f1245cba1))
* replace axios with axiosInstance for API calls; handle token and error responses ([a06009f](https://github.com/Temkum/sparrowcakes-cms/commit/a06009febb8d80581dbd73cfd412f004d50cb476))

## [1.3.0](https://github.com/Temkum/sparrowcakes-cms/compare/v1.2.0...v1.3.0) (2025-04-05)


### Features

* fetch categories from API in CategoryList; update CategoriesTable to include create category modal ([6908a46](https://github.com/Temkum/sparrowcakes-cms/commit/6908a46e5965bdc3421baf6d67c3dc434a600051))
* implement category details view with modal; add created_at to Category interface; update global styles ([8152639](https://github.com/Temkum/sparrowcakes-cms/commit/815263979460ad731a2d7a146b3000f8895f3e3e))

## 1.2.0 (2025-03-31)


### Features

* add bulk delete functionality to CategoriesTable; refactor component exports to default ([fe3cf68](https://github.com/Temkum/sparrowcakes-cms/commit/fe3cf68a776ba315bf5397d1cbc7cf37f5dbe5b2))
* add debounce utility function; implement token expiration check in auth store; update Categories page to use CategoryFormModal ([3a824c6](https://github.com/Temkum/sparrowcakes-cms/commit/3a824c65be7fa8f824dc677b7ac1175083e536b6))
* add Login and Register pages; implement routing and new Label component; update AppSidebar and TopMenu ([397b039](https://github.com/Temkum/sparrowcakes-cms/commit/397b039659e41c54c08afd524b0ed4d8bf4e0b45))
* add Password Reset functionality; implement ResetPassword and ResetPasswordLink components; update routing ([9916b9c](https://github.com/Temkum/sparrowcakes-cms/commit/9916b9c0410a7581e62d97f0dc52dcd20a03497d))
* enhance category creation; add image upload functionality and update default isActive value ([43d0b22](https://github.com/Temkum/sparrowcakes-cms/commit/43d0b226f2a53bb1bf926a4e8617f03eaa1ed310))
* implement Login functionality; add form validation, error handling, and integrate authentication service ([#3](https://github.com/Temkum/sparrowcakes-cms/issues/3)) ([0c6bedf](https://github.com/Temkum/sparrowcakes-cms/commit/0c6bedf42a92e70d04c67c89c1ffae544c70c509))
* implement pagination for categories table; add page and limit state management ([c25ad77](https://github.com/Temkum/sparrowcakes-cms/commit/c25ad776b825b59eb09d42a3a55a95f4b11f4fad))
* refactor category management; update is_active to isActive and improve category creation logging ([ba591f8](https://github.com/Temkum/sparrowcakes-cms/commit/ba591f8fee1473f4520a0e21c32c4f2079be4983))
* update and refactor product and category management pages; implement AddProduct and CategoriesPage components ([35e0764](https://github.com/Temkum/sparrowcakes-cms/commit/35e0764b5e06573c8b0b4d5a0c81a42c6d9ec3a8))
* update Category interface; rename updatedDate to updated_at for consistency ([ea65144](https://github.com/Temkum/sparrowcakes-cms/commit/ea65144ae27f69712be7c9679b7ea88a270b4298))
* update registration functionality; include name in registration process and log registration data ([a4774b0](https://github.com/Temkum/sparrowcakes-cms/commit/a4774b011846ccf827b266a1a1c8b095b3ffaffa))

### [1.1.1](https://github.com/Temkum/sparrowcakes-cms/compare/v1.1.0...v1.1.1) (2025-03-23)

## 1.1.0 (2025-03-23)


### Features

* add JWT decoding and token management; implement NotAuthorized page and update auth service ([ab3f543](https://github.com/Temkum/sparrowcakes-cms/commit/ab3f5435b43e08dc2299a457e5694e22c773c095))
* add Login and Register pages; implement routing and new Label component; update AppSidebar and TopMenu ([397b039](https://github.com/Temkum/sparrowcakes-cms/commit/397b039659e41c54c08afd524b0ed4d8bf4e0b45))
* add Password Reset functionality; implement ResetPassword and ResetPasswordLink components; update routing ([9916b9c](https://github.com/Temkum/sparrowcakes-cms/commit/9916b9c0410a7581e62d97f0dc52dcd20a03497d))
* enhance login error handling; display error messages in the UI and integrate Toaster for notifications ([26de1ed](https://github.com/Temkum/sparrowcakes-cms/commit/26de1ed964e51241ee3503702ca8fd204de861aa))
* implement authentication state management; add ProtectedRoute component and update navigation for logout ([ce7895b](https://github.com/Temkum/sparrowcakes-cms/commit/ce7895bd90faad33513c4bc55df5cf6b0336b8a0))
* implement forgot password functionality; add ForgotPassword component, update routing, and enhance API service for password reset ([3f40d72](https://github.com/Temkum/sparrowcakes-cms/commit/3f40d720500ff63540b8a27cd30a57817d675192))
* implement Login functionality; add form validation, error handling, and integrate authentication service ([62f2f9d](https://github.com/Temkum/sparrowcakes-cms/commit/62f2f9d047a214122c52d3dddcf563d5a91cf38b))
* implement registration functionality; add form validation, error handling, and integrate authentication service ([3c91c98](https://github.com/Temkum/sparrowcakes-cms/commit/3c91c980fecbd2bad33197f5f3bbc25d20f171c9))
* update registration flow; redirect to login after successful registration and enhance loading state management in auth store ([d3cc80c](https://github.com/Temkum/sparrowcakes-cms/commit/d3cc80c5fe875942df322614d8710d7f267b72f1))
