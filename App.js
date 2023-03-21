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
  const handleAddItem =()=>{
    const itemsToAddToList={
                            id: idNum,
                            name: productDesc,
                            price: productPrice,
                            taxed: taxable
                          }
                          
    
    if(productPrice.trim() !== ""){
      setList([...list, itemsToAddToList])
      setTaxable(false)
      setProductDesc('')
      setProductPrice('')
      setIdNum(idNum + 1) 
      {!productDesc ? ToastAndroid.show('Not Required But We Recomend Adding A Description', ToastAndroid.LONG):""}                          
    
      ToastAndroid.show('Product Added', ToastAndroid.SHORT)
    
    }else{ alert("Product Price Required")}
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
  const renderItems = ({item, index})=>(
    <View style={styles.listItemRow}>
      <View style={[styles.itemBox, {flex:2}]}>
        <Text style={styles.listItemText}>{item.name}</Text>
      </View>     
      <View style={[styles.itemBox, {flex:2, alignItems: 'center'}]}>
          <Text numberOfLines={1} ellipsizeMode='tail'  style={styles.listItemText}>${item.taxed === true ? Number((item.price * 1.0825).toFixed(2)):item.price}</Text>
      </View>      
      <View style={[styles.itemBox, {alignItems: 'center'}]}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=>handleSwitchChange(index)}
          value={item.taxed}
        />
      </View>
      <View style={[styles.itemBox, {flex:2, alignItems: 'center'}]}>
        <Button style={styles.button} textStyle={styles.buttonText} title="DELETE" onPress={()=>handleDeleteItem(item.id)}/>
      </View>
    </View>
  )

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
                    value={budgetLimit}
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
            style={styles.input}
            onChangeText={setProductDesc}
            value={productDesc}
            placeholder="Product Description"
            keyboardType="default"
            />
          </View>
          <View style={[styles.innerSubContainer, {flexDirection:'row'}]}>
            <View style={[styles.innerSubContainer,{flex: 2}]}>
              <TextInput
              style={styles.input}
              onChangeText={setProductPrice}
              value={productPrice}
              placeholder="Product Price"
              keyboardType="numeric"
              />
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
            <View style={styles.listItemRow}>
              <View style={[styles.itemBox,{flex:2}]}>
                <Text style={[styles.listItemText, {fontSize: fontScale*3,fontWeight:'bold'}]}>Item</Text>
              </View>
              <View style={[styles.itemBox, {flex:2, alignItems: 'center'}]}>
                <Text style={[styles.listItemText, {fontSize: fontScale*3,fontWeight:'bold'}]}>Price</Text>
              </View>
              <View style={[styles.itemBox, {alignItems: 'center'}]}>
                <Text style={[styles.listItemText, {fontSize: fontScale*3,fontWeight:'bold'}]}>Tax?</Text>
              </View>
              <View style={[styles.itemBox, {flex:2, alignItems: 'center'}]}>
                <Text style={[styles.listItemText, {fontSize: fontScale*3,fontWeight:'bold'}]}>Delete?</Text>
              </View>
            </View>
            <FlatList
              style={styles.list}
              data={list}
              renderItem={renderItems}
              keyExtractor={(list, index) => index.toString()}/>
          </View>
        </View>
        <View style={styles.btads}>
          <TouchableOpacity onPress={()=>{Linking.openURL("https://www.bettertechsol.com/")}}>
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
    marginTop: 20
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  itemBox:{
    flex: 1,
    margin: 5,
  },
  listItemText: {
    color: "black",
    fontSize: fontScale*4,
    marginBottom: 10
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
});

export default Flex;