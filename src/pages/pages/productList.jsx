import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from "react-icons/tb";
import Button from '../../components/common/Button';


const ProductList = ({ products, onAddProduct }) => {
  return (
    <div className="product-list">
      <div className="btn_parent">
      <h3>Products</h3>
                {/* <Button
                  label="Add Product"
                  icon={<Icons.TbPlus />}
                  className="sm"
                  onClick={onAddProduct}
                /> */}

              </div>
      <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_image">image</th>
                      <th className="td_name" colSpan="4">name</th>
                      <th>price</th>
                      <th>store</th>
                      <th>sku</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, key) => (
                      <tr key={key}>
                        <td className="td_image">
                          <img
                            src={product.productImages?.[0] || "placeholder-image-url"}
                          />
                        </td>
                        <td className="hyperlink-ProductText" colSpan="4">
                          <Link to={product._id}>{product.title}</Link>
                        </td>
                        <td>
                          {`${product.pricing.price} `}
                          <b>€</b>
                        </td>
                        <td>{product.shopType}</td>
                        <td>{product.SKU}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
    </div>
  );
};

export default ProductList;