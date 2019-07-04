import axios from 'axios';
import base64 from 'base-64';
import omit from 'lodash/omit';

import config from '../config';
import store from '../store';
import i18n from '../utils/i18n';

const headers = {
  'Content-Type': 'multipart/form-data',
};

// Config axios defaults.
const AxiosInstance = axios.create({
  baseURL: `${config.baseUrl}graphql`,
  timeout: 100000,
});

AxiosInstance.interceptors.request.use((conf) => {
  const state = store.getState();
  const newConf = { ...conf };
  headers['Storefront-Api-Access-Key'] = config.apiKey;
  headers['Cache-Control'] = 'no-cache';

  if (state.auth.token) {
    headers.Authorization = `Basic ${base64.encode(state.auth.token)}:`;
  }
  newConf.headers.common = headers;

  return newConf;
});

const gql = (query, variables) => AxiosInstance.post('', { query, variables });

export const steps = [
  i18n.gettext('Image'),
  i18n.gettext('Enter the name'),
  i18n.gettext('Enter the price'),
];

export const getProductDetail = (id) => {
  const QUERY = `query getProducts($id: Int!) {
      product(id: $id, get_icon: true, get_detailed: true, get_additional: true) {
        product_id
        product
        price
        full_description
        list_price
        status
        product_code
        amount
        weight
        free_shipping
        product_features {
          feature_id
          value
          variant_id
          variant
          feature_type
          description
        }
        categories {
          category_id
          category
        }
        image_pairs {
          icon {
            image_path
          }
        },
        main_pair {
          icon {
            image_path
          }
        }
      }
    }
  `;
  return gql(QUERY, { id }).then(result => result.data);
};

export const updateProduct = (id, product) => {
  const QUERY = `
    mutation updateProduct($id: Int!, $product: UpdateProductInput!) {
      update_product(id: $id, product: $product)
    }
  `;
  return gql(QUERY, { id, product }).then(result => result.data);
};

export const deleteProduct = (id) => {
  const QUERY = `
    mutation deleteProduct($id: Int!) {
      delete_product(id: $id)
    }
  `;
  return gql(QUERY, { id }).then(result => result.data);
};

export const createProduct = (product) => {
  const data = new FormData();
  const renderImagePairs = () => {
    const images = [...product.images];
    const params = [];
    const pairs = [];
    const variables = {};

    if (!images.length) {
      return '';
    }

    images.forEach((image, index) => {
      if (index === 1) {
        variables[index] = ['variables.main'];
        return params.push(
          `
            main_pair: {
              detailed: {
                upload: $main
              }
            }
          `
        );
      }

      variables[index] = [`variables.image_${index}`];
      return pairs.push(`
        {
          detailed: {
            upload: $image_${index}
          }
        }
      `);
    });

    if (pairs.length) {
      params.push(`
        image_pairs: [${pairs.join(', ')}]
      `);
    }

    data.append('map', JSON.stringify(variables));

    return params.join(', ');
  };

  const renderParams = () => {
    const images = [...product.images];
    const params = [];

    if (!images.length) {
      return '';
    }

    images.forEach((image, index) => {
      if (index === 1) {
        return params.push('$main: FileUpload');
      }

      return params.push(
        `$image_${index}: FileUpload`
      );
    });
    return params.join(', ');
  };

  const QUERY = `
    mutation createProduct(
      $product: String!,
      $category_ids: [Int]!,
      $price: Float!,
      $full_description: String,
      $amount: Int
      ${renderParams()}
    ) {
      create_product(product: {
        product: $product
        category_ids: $category_ids
        price: $price
        full_description: $full_description
        amount: $amount
        ${renderImagePairs()}
      })
    }
  `;

  const serializedData = JSON.stringify({
    query: QUERY,
    variables: {
      ...omit(product, ['images']),
      main: null,
      image_0: null,
    }
  });
  data.append('operations', serializedData);

  product.images.forEach((image, index) => {
    const photo = {
      uri: image,
      type: 'image/jpeg',
      name: `${index}.jpg`,
    };
    data.append(index, photo);
  });

  return AxiosInstance.post('', data).then(result => result.data);
};

export const getProductsList = (page = 1) => {
  const QUERY = `query getProducts($page: Int) {
    products(page: $page, items_per_page: 50) {
      product
      price
      amount
      product_code
      product_id
      main_pair {
        icon {
          image_path
        }
      }
    }
  }`;

  return gql(QUERY, { page }).then(result => result.data);
};

export const getCategoriesList = (parent = 0, page = 1) => {
  const QUERY = `
    query getCategories($parent: Int!, $page: Int!) {
      categories(parent_category_id: $parent, page: $page, items_per_page: 100) {
        status
        category
        category_id
      }
    }
  `;

  return gql(QUERY, { parent, page }).then(result => result.data);
};
