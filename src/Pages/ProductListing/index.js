import React, { useState, useEffect } from 'react';
import { Box, Table, Pagination, Select, NumberInput, Button, Loader } from '@mantine/core'
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Api-Key rAWUqmtA.ZVtBHdvdRKYY6wb8JaNufUXAYBbrH0JC'
    }
};
//codesubmission-sumtracker

const ProductListing = () => {
    const [productList, setProductList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [quantityType, setQuantityType] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [productLoader, setProductLoader] = useState('');

    const NumberOfResult = 20;
    const [totalPageCount, setTotalPageCount] = useState(0);
    const baseUrl = 'https://staging.inventory-api.sumtracker.com/api/version/2024-04'

    useEffect(() => {
        const getProductList = async () => {

            let startIndex = (pageNumber - 1) * NumberOfResult
            // let limit = startIndex + pageNumber * NumberOfResult // 0 + 1*20
            let query = `?offset=${startIndex}&limit=${NumberOfResult}`
            const response = await fetch(`${baseUrl}/stock/levels/${query}`, options);
            if (response.ok) {
                const result = await response.json();
                console.log('results are', result)
                setProductList(result.results)
                setTotalPageCount(Math.floor(result.count / NumberOfResult));
            }

        }
        getProductList()

    }, [pageNumber]) // pagintation modal
    const updateProductQuantity = async (body) => {
        setProductLoader(body);
        let options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: 'Api-Key rAWUqmtA.ZVtBHdvdRKYY6wb8JaNufUXAYBbrH0JC'
            },
            body: JSON.stringify({
                ...body,
                adjustment_type: quantityType,
                quantity: quantity

            })
        };
        const response = await fetch(`${baseUrl}/operations/stock/adjust/`, options);
        if (response.ok) {

            const result = await response.json();
            console.log('results are', result)
            const newDetails = result.product;
            let newProductList = productList.map((product) => {

                if (product && product.product.id == newDetails.id && product.warehouse.id == result.warehouse.id) {
                    console.log('matching ');
                    return result;
                } else return product;
            });
            setProductLoader('')

            setProductList(newProductList)
            setTotalPageCount(Math.floor(result.count / NumberOfResult));
        }
        setProductLoader('')
    }

    const listHeader = [
        'Product',
        'Warehouse',
        'In stock',
        'Edit stock',
        'Action'

    ]
    const rows = productList && productList.length > 0 && productList.map((eachRow) => {
        return <>
            <tr key={eachRow.product.id}>
                <td>{eachRow.product.name}</td>
                <td>{eachRow.warehouse.name}</td>
                <td>{eachRow.in_stock}</td>
                <td>
                    <Select
                        label="Type"
                        placeholder="Pick one"
                        data={[
                            { value: 'SET', label: 'SET' },
                            { value: 'ADD', label: 'ADD' },
                            { value: 'SUB', label: 'SUB' }
                        ]}
                        onChange={setQuantityType}
                    />
                    <NumberInput
                        defaultValue={0}
                        placeholder="Seclect Quantity"
                        label="Quantity"
                        withAsterisk
                        onChange={(e) => { setQuantity(e) }}
                    />

                </td>
                <td> {productLoader && eachRow.product.id == productLoader.product_id && eachRow.warehouse.id == productLoader.warehouse_id ? <Loader /> : <Button onClick={() => { updateProductQuantity({ product_id: eachRow.product.id, warehouse_id: eachRow.warehouse.id }) }}> Save </Button>}</td>
            </tr>
        </>
    })
    return (
        <Box ml="lg" mr="lg" mt="lg">
            <Table>
                <thead>
                    <tr>
                        {listHeader && listHeader.map((headerName) => {
                            return <th> {headerName}</th>
                        })}
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            <Pagination value={pageNumber} onChange={setPageNumber} total={totalPageCount} />
        </Box>
    )
}

export default ProductListing