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
  KeyboardAvoidingView
} from 'react-native';


//Gets screen size and allows for adjustments
const { width, height } = Dimensions.get('window');
const fontScale = Math.sqrt(width * height) / 100;

const data=[
  {
    id: '0',
    name: 'Can of Peaches',
    price: '2.37',
    taxed: false
  },
  {
    id: '1',
    name: 'Can of Potatos',
    price: '3.68',
    taxed: false
  },
  {
    id: '2',
    name: 'Can of Corn',
    price: '5.28',
    taxed: true
  }
]

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
  const [taxable, setTaxable] = useState(false)
  const [idNum, setIdNum] = useState(0)

  
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
  const handleAddToList = ()=>{
    setList(data)
  }

  const handleAddItem =()=>{
    const itemsToAddToList={
                            id: idNum,
                            name: productDesc,
                            price: productPrice,
                            taxed: taxable
                          }

    if(productDesc.trim() !== "" || productPrice.trim() !== ""){
      setList([...list, itemsToAddToList])
      setTaxable(false)
      setProductDesc('')
      setProductPrice('')
    }
    setIdNum(idNum + 1) 
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

  return (
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
          minHeight: Math.round(Dimensions.get('window').height)
        },
      ]}>
      <View style={[styles.subContainer,{flex: 1, borderWidth: 2, justifyContent: 'flex-end'}]}  >
        <Text style={styles.header}>Budget As You Shop App</Text>
      </View>
      <View style={[styles.subContainer,{flex: 2, borderWidth: 2,}]} >
        <Text style={styles.header}>{`Total Taxed: $${totalTaxed.toFixed(2)}`}</Text>
        <Text style={styles.header}>{`Total Nontaxed: $${totalUntaxed.toFixed(2)}`}</Text>
        <Text style={[styles.header,{fontSize: fontScale*5,fontWeight: 'bold'}]}>{`Total price: $${totalPrice.toFixed(2)}`}</Text>
      </View>
      <View style={[styles.subContainer,{flex: 3, borderWidth: 2,}]} >
        <View style={styles.subContainer}>
          <TextInput
          style={styles.input}
          onChangeText={setProductDesc}
          value={productDesc}
          placeholder="Product Description"
          keyboardType="default"
          />
        </View>
        <View style={[styles.subContainer, {flexDirection:'row'}]}>
          <View style={[styles.subContainer,{flex: 2}]}>
            <TextInput
            style={styles.input}
            onChangeText={setProductPrice}
            value={productPrice}
            placeholder="Product Price"
            keyboardType="numeric"
            />
          </View>
          <View style={[styles.subContainer,{flex: 1, alignItems:"center"}]}>
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
      <View style={[styles.subContainer,{flex: 6, borderWidth: 2,}]} >
        <View style={[styles.subContainer,{flex: 1, borderWidth: 2,}]} >
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
    </View>
  );
};

const borderCol = 'blue'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black',
  },
  subContainer:{
    borderColor: borderCol,
    
  },
  header:{
    textAlign: 'center',
    fontSize: fontScale*4,
    color: "white", 
  },
  text:{
    color: "white",
    textAlign: 'center',
    fontSize: fontScale*3,
  },
  list: {
    color: "white",
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
    color: "white",
    fontSize: fontScale*4,
    marginBottom: 10
  },
  input:{
    height: 40,
    margin: 12,
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
});

export default Flex;