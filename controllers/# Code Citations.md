# Code Citations

## License: unknown
https://github.com/piy1577/Ecommerce-frontend/tree/afc6a3214efff33e1d77a698746672f75a90e6e0/src/pages/Admin/AdminOrders.js

```
, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/
```


## License: unknown
https://github.com/manjureddy97/Amazone_clone/tree/d9d1eb4bd1d2df20317917241d0eb0e041447b07/client/src/pages/Admin/AdminOrders.js

```
./components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from
```


## License: unknown
https://github.com/minktruong1/Ggear-reactshop/tree/45680e741b3e1c15ef1f0c3ecd8cd147e070950e/client/src/pages/Admin/AdminOrders.js

```
"moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
```


## License: MIT
https://github.com/AJEDDIGElias/MERN_ECommerce_App/tree/fac70433355aaf3330f07ad4bb0d80671f791f79/client/src/pages/Admin/AdminOrders.js

```
{ Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]
```


## License: unknown
https://github.com/insane-22/jungle/tree/a03824eef3d915d63390a6e8d3fe743c015f61df/client/src/pages/Admin/AdminOrders.js

```
Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const {
```

