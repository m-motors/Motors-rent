
function VeiculCard (){
    const data:any = [
        {id: 1,created_at: "2025-02-11 22:02:12",available: true,brand: "Toyota",model: "Corolla",year: 2020,horsepower: 132,price: 20000,category: "Sedan",motor: "Gasoline",color: "White",mileage: 15000,},
        {id: 2,created_at: "2025-02-11 22:02:12",available: true,brand: "Honda",model: "Civic",year: 2019,horsepower: 158,price: 22000,category: "Sedan",motor: "Gasoline",color: "Black",mileage: 12000,},
        {id: 3,created_at: "2025-02-11 22:02:12",available: true,brand: "Ford",model: "Mustang",year: 2021,horsepower: 450,price: 35000,category: "Coupe",motor: "Gasoline",color: "Red",mileage: 5000,},
        {id: 4,created_at: "2025-02-11 22:02:12",available: true,brand: "Chevrolet",model: "Camaro",year: 2020,horsepower: 275,price: 33000,category: "Coupe",motor: "Gasoline",color: "Blue",mileage: 8000,},
        {id: 5,created_at: "2025-02-11 22:02:12",available: true,brand: "BMW",model: "3 Series",year: 2018,horsepower: 255,price: 28000,category: "Sedan",motor: "Gasoline",color: "Gray",mileage: 20000,},
    ]; 
    return (
        <div>
            <h2>Vehicle List</h2>
            {data.map((data: any) => (
                <div key={data.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", borderRadius: "5px" }}>
                    <p><strong>Brand:</strong> {data.brand}</p>
                    <p><strong>Model:</strong> {data.model}</p>
                    <p><strong>Price:</strong> ${data.price}</p>
                    <p><strong>Motor:</strong> {data.motor}</p>
                    <p><strong>Mileage:</strong> {data.mileage} km</p>
                </div>
            ))}
        </div>
    )
}

export default VeiculCard