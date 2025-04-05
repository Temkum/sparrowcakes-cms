# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
