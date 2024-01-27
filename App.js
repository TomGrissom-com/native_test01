import React, {useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
  FlatList,
  Switch,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ToastAndroid,
  Image,
  Linking
} from 'react-native';


//Gets screen size and allows for adjustments
const { width, height } = Dimensions.get('window');
const fontScale = Math.sqrt(width * height) / 100;
const NotificationBarHeight = StatusBar.currentHeight

const Flex = () => {
//general states
  const [list, setList]=useState([])
  const [isEnabled, setIsEnabled] = useState(false);
  const [taxedItems, setTaxedItems] = useState([]);
  const [totalTaxed, setTotalTaxed] = useState(0);
  const [untaxedItems, setUntaxedItems] = useState([]);
  const [totalUntaxed, setTotalUntaxed] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
//new product states
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [idNum, setIdNum] = useState(0);
  const [budgetLimit, setBudgetLimit]=useState('');
  const [changeBudget, setChangeBudget]=useState(false);

  
  useEffect(()=>{
    const taxedThings = list.filter(item => item.taxed === true).map((item)=>{return item.price});
    setTaxedItems(taxedThings)
    const untaxedThings = list.filter(item => item.taxed === false).map((item)=>{return item.price});
    setUntaxedItems(untaxedThings)
    sumArrayValues(untaxedThings, taxedThings)
  },[list])
  
    
  function sumArrayValues(arr,arr2) {
    const initialValue2 = 0;
    const totalSum2 = arr2.reduce((accumulator2, currentValue2) => {
      return accumulator2 + parseFloat(currentValue2);
    }, initialValue2);
    const totalSum2WithTax = totalSum2*1.0825
    
    const initialValue = 0;
    const totalSum = arr.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue);
    }, initialValue);

    setTotalTaxed(totalSum2WithTax);
    setTotalUntaxed(totalSum);
    setTotalPrice(totalSum+totalSum2WithTax)
  }
  
//handlers
  const handleAddItem = () => {
    const totalItemPrice = parseFloat(productPrice) * parseInt(productQuantity);

    const itemsToAddToList = {
      id: idNum,
      name: productDesc,
      price: totalItemPrice, // Now this represents the total price of the product
      quantity: productQuantity, // Optionally, store the quantity as well
      taxed: taxable,
      unitPrice: parseFloat(productPrice),
    }

    if (productPrice.trim() !== "" && productQuantity > 0) {
      setList([...list, itemsToAddToList]);
      setTaxable(false);
      setProductDesc('');
      setProductPrice('');
      setProductQuantity(1); // Resetting the quantity to 1 for the next item
      setIdNum(idNum + 1);

      {!productDesc ? ToastAndroid.show('Not Required But We Recommend Adding A Description', ToastAndroid.LONG) : ""}
      ToastAndroid.show('Product Added', ToastAndroid.SHORT);

    } else {
      alert("Product Price and Quantity are Required");
    }
  }
 const handleDeleteItem = (id)=>{
  const filteredItems = list.filter((item) => item.id !== id);
    setList(filteredItems);
  }
  const handleSwitchChange = index => {
    const updatedArray = [...list];
    updatedArray[index].taxed = !updatedArray[index].taxed;
    setList(updatedArray);
  };
  const handleSetBudget = (bl)=>{
    ToastAndroid.show('Tap Blue Text To Change Budget', ToastAndroid.SHORT);
    setBudgetLimit(bl)
    setChangeBudget(true)
  }
  
//RENDER ITEMS FROM LIST
const renderItems = ({ item, index }) => (
  <View style={[{borderBottomColor:"gray", borderBottomWidth:1}]}>
    <View style={styles.listItemRow}>
      <Text style={styles.listItemText}>{item.name}</Text>
    </View>
    <View style={styles.listItemRow}>
      <View style={[styles.itemBox, {flex:2, alignItems:'flex-start'}]}>
        <Text style={[styles.listItemText]}>${item.taxed === true ? Number((item.price * 1.0825).toFixed(2)) : item.price}</Text>
      </View>
      <View style={[styles.itemBox, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => handleDecrementQuantity(index)} style={styles.quantityButton}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleIncrementQuantity(index)} style={styles.quantityButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.itemBox, { alignItems: 'center', flex: 1}]}>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => handleSwitchChange(index)}
          value={item.taxed}
        />
      </View>
      <View style={[styles.itemBox, { alignItems: 'center' }]}>
        <Button style={styles.button} textStyle={styles.buttonText} title="DELETE" onPress={() => handleDeleteItem(item.id)} />
      </View>
    </View>
  </View>
);

const handleIncrementQuantity = (index) => {
  const updatedList = [...list];
  // Ensure the quantity is treated as a number
  updatedList[index].quantity = parseInt(updatedList[index].quantity, 10) + 1;
  updatedList[index].price = updatedList[index].quantity * updatedList[index].unitPrice;
  setList(updatedList);
  // Update total price and other related states
};

const handleDecrementQuantity = (index) => {
  const updatedList = [...list];
  // Convert quantity to an integer before comparing and decrementing
  const currentQuantity = parseInt(updatedList[index].quantity, 10);

  if (currentQuantity > 1) {
    updatedList[index].quantity = currentQuantity - 1;
    updatedList[index].price = updatedList[index].quantity * updatedList[index].unitPrice;
    setList(updatedList);
    // Update total price and other related states
  }
};



//css variables
  const budgetColor = 
    Number(budgetLimit).toFixed(2)-Number(totalPrice).toFixed(2) <=10 
    && 
    Number(budgetLimit).toFixed(2)-Number(totalPrice).toFixed(2) >1
    ? 
    "rgb(247,128,74)"
    : 
    Number(budgetLimit).toFixed(2)-Number(totalPrice).toFixed(2) <= 1 ? "red":"green"

//VIEW PORT    
  return (
    <ImageBackground source={require('./assets/splash.png')} style={styles.background}>  
      <View
        style={[
          styles.container,
          {
            flexDirection: 'column',
            minHeight: Math.round(Dimensions.get('window').height)
          },
        ]}>
        <View style={[styles.subContainer,{flex: 2, justifyContent: 'center'}]}  >
          <Text style={styles.header}>Budget As You Shop</Text>
          <Text style={[styles.header,{fontSize: fontScale*2}]}>By: BetterTech</Text>
          <View style={[styles.innerSubContainer, {flexDirection:'row'}]}>
            <View style={[styles.innerSubContainer,{flex: 1}]}>
              {
                !changeBudget ? 
                <View style={[styles.innerSubContainer, {flexDirection:'row'}]}>
                  <View style={[styles.innerSubContainer, {flex:2, justifyContent:"center"}]}>
                    <TextInput
                    style={styles.input}
                    onChangeText={setBudgetLimit}
                    value={budgetLimit.toString()}
                    placeholder="Set Budget Amount"
                    keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.innerSubContainer, {flex:1, justifyContent:"center"}]}>
                    <Button title="Set Budget" onPress={()=>handleSetBudget(budgetLimit)}/>
                  </View>
                </View>
              :

              <View style={[styles.innerSubContainer, {flexDirection:'row'}]}>
                <TouchableOpacity onPress={()=>setChangeBudget(false)}>
                  <Text style={[styles.header,{color: "blue",fontSize: fontScale*5,fontWeight: 'bold'}]}>{`Budget: $${Number(budgetLimit).toFixed(2)}`}</Text>
                </TouchableOpacity>
              </View>
              
              }
            </View>
          </View>
        </View>
        <View style={[styles.subContainer,{flex: 1.5, backgroundColor:"lightgray"}]} >
          {
            budgetLimit ==0 
            ?
            <Text style={[styles.header,{fontSize: fontScale*5,fontWeight: 'bold'}]}>Set Your Budget Above</Text>
            :
            <>
              <Text style={[styles.header,{fontSize: fontScale*5,fontWeight: 'bold'}]}>{`Products: $${totalPrice.toFixed(2)}`}</Text>
              <Text style={[styles.header,{color: budgetColor,fontSize: fontScale*5,fontWeight: 'bold'}]}>{`Remaining: $${Number(budgetLimit-totalPrice).toFixed(2)}`}</Text>
            </>
          
          }
        </View>
        <View style={[styles.subContainer,{flex: 2.5, marginBottom:5,marginTop:5}]} >
          <View style={styles.innerSubContainer}>
            <TextInput
            style={[styles.input, {height: "40px"}]}
            onChangeText={setProductDesc}
            value={productDesc.toString()}
            placeholder="Product Description"
            keyboardType="default"
            />
          </View>
          <View style={[styles.innerSubContainer, {flexDirection:'row'}]}>
            <View style={[styles.innerSubContainer,{flex: 2}]}>
              <View style={[styles.innerContainer, {flexDirection:'row'}]}>
                <Text style={[styles.text]}>Price</Text>
                <TextInput
                style={[styles.input, {flex:1}]}
                onChangeText={setProductPrice}
                value={productPrice.toString()}
                placeholder="Price"
                keyboardType="numeric"
                />
              </View>

              <View style={[styles.innerContainer, {flexDirection:'row'}]}>
                <Text style={[styles.text]}>Quantity</Text>
                <TextInput
                style={[styles.input, {flex:1}]}
                onChangeText={setProductQuantity}
                value={productQuantity.toString()}
                placeholder="Quantity"
                keyboardType="numeric"
                />
              </View> 
            
            </View>
            <View style={[styles.innerSubContainer,{flex: 1, alignItems:"center"}]}>
              <Text style={styles.text}>Taxable</Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>setTaxable(previousState => !previousState)}
                value={taxable}
              />
            </View>
          </View>
            <Button title="Add item" onPress={handleAddItem} />
        </View>
        <View style={[styles.subContainer,{flex: 6}]} >
          <View style={[styles.innerSubContainer,{flex: 1, marginTop:5, backgroundColor:'lightgray', borderBottomRightRadius:10, borderBottomLeftRadius: 10}]} >

            <FlatList
              style={styles.list}
              data={list}
              renderItem={renderItems}
              keyExtractor={(list, index) => index.toString()}/>
          </View>
        </View>
        <View  
          style={styles.btads}
        >
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Link to BetterTech webiste"
            accessibilityHint="navigates to BetterTech website"
            onPress={()=>{Linking.openURL("https://www.bettertechsol.com/")}}
          >
            <Image source={require('./assets/btbanner.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const borderCol = 'red'
const borderWidth = 0

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1, 
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  subContainer:{
    borderColor: borderCol,
    borderWidth: borderWidth,
    paddingLeft:15,
    paddingRight:15,
    justifyContent:'center'
  },
  innerSubContainer:{
    borderColor: borderCol,
    borderWidth: borderWidth,
    margin:0,
    justifyContent:'center'
  },
  innerContainer:{
    flexDirection: 'row',
    borderColor: borderCol,
    borderWidth: borderWidth,
    margin:0,
    justifyContent:'left',
    alignItems:'center'
  },
  header:{
    textAlign: 'center',
    fontSize: fontScale*4,
    color: "black", 
  },
  text:{
    color: "black",
    textAlign: 'center',
    fontSize: fontScale*3,
  },
  list: {
    color: "black",
    flex: 1,
    marginTop: '5px',
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    paddingBottom:0,
  },
  itemBox:{
    flex: 1,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: borderCol,
    borderWidth: borderWidth,
  },
  listItemText: {
    color: "black",
    fontSize: fontScale * 4,
    padding: 1, // Add padding for a better look
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: borderCol,
    borderWidth: borderWidth,
  },
  input:{
    height: 40,
    margin: 5,
    borderWidth: 2,
    color: 'black',
    borderColor:'black',
    backgroundColor: 'white',
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 0,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap'
  }, 
  btads:{
    height: 100,
    justifyContent:'center',
    alignContent:"center"
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 1
  },
  quantityButton: {
    backgroundColor: '#81b0ff',  // Choose a background color for the button
    padding: 0,                   // Adjust padding to change the size of the button
    borderRadius: 20,              // Half of width and height to make it circular
    justifyContent: 'center',      // Center content horizontally
    alignItems: 'center',          // Center content vertically
    width: 40,                     // Width of the button
    height: 40,                    // Height of the button
    marginHorizontal: 10,          // Space around the button
  },
  buttonText: {
    color: "black",
    fontSize: fontScale * 4,
    marginHorizontal: 10, // Add horizontal spacing
  },
  quantityText:{
    fontSize: fontScale * 4,
  },
});

export default Flex;