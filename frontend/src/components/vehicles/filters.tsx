import '../../styles/globals.css'

function Filters(){
    return(
        <div>
            <ul>
                <li>
                    <label htmlFor="Brand">brend : </label>
                    <select name="Brand" id="Brand">
                        <option value="choice_your_brand">Choice your brand</option>
                        <option value="toyota">Toyota</option>
                        <option value="volkswagen">Volkswagen</option>
                        <option value="hyundai">Hyundai</option>
                        <option value="general-motors">General Motors</option>
                        <option value="ford">Ford</option>
                        <option value="honda">Honda</option>
                        <option value="nissan">Nissan</option>
                        <option value="bmw">BMW</option>
                        <option value="mercedes">Mercedes-Benz</option>
                        <option value="tesla">Tesla</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="category">category : </label>
                    <select name="category" id="category">
                        <option value="sedan">coose the categor</option>
                        <option value="sedan">Sedan</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="coupe">Coupe</option>
                        <option value="convertible">Convertible</option>
                        <option value="wagon">Wagon</option>
                        <option value="pickup">Pickup Truck</option>
                        <option value="van">Van</option>
                        <option value="crossover">Crossover</option>
                        <option value="off-road">Off-Road</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="year">year: </label>
                    <select name="year" id="year">
                        <option value="chooseYear">Choose the year</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="horsPower">horsPower: </label>
                    <select name="horsPower" id="horsPower">
                    <option value="stepChoos">choice your power gamme</option>
                    <option value="step1">130 - 160</option>
                    <option value="step2">161-200</option>
                        <option value="step3">201-2030</option>
                        <option value="step4">2031-2060</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="prace">prace: </label>
                    <select name="price" id="price">
                    <option value="stepChoos">choice your prace gamme</option>
                    <option value="step1">1900-2400</option>
                    <option value="step2">2401-2900</option>
                        <option value="step3">2901-3400</option>
                        <option value="step4">3401-4000</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="motore">motore: </label>
                    <select name="motore" id="motore">
                    <option value="motoreCoose">choice the motore</option>
                    <option value="gasoline">gasoline</option>
                    <option value="essance">essance</option>
                        <option value="electric">electric</option>
                        <option value="hybride">hybride</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="Mileage">Mileage: </label>
                    <select name="Mileage" id="Mileage">
                    <option value="MileageChoos">choice the Mileage maximal</option>
                    <option value="Mileage1">500</option>
                    <option value="Mileage2">1000</option>
                        <option value="Mileage3">1500</option>
                        <option value="Mileage4">2000</option>
                    </select>
                </li>
            </ul>
        </div>
    )}

export default Filters