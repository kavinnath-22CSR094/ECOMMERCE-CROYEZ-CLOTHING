import { useState, useEffect } from "react";
import axios from "axios";

export default function useSize() {
  const [sizes, setSizes] = useState([]);

  //get cat
  const getSizes = async () => {
    try {
      const { data } = await axios.get("/api/v1/size/get-size");
      setSizes(data?.size);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSizes();
  }, []);

  return sizes;
}
