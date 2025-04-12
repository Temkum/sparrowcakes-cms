import axiosInstance from './axiosInstance';

export const createProduct = async (productData: FormData, token: string) => {
  try {
    const response = await axiosInstance.post('/products', productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  productData: FormData,
  token: string
) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number, token: string) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
