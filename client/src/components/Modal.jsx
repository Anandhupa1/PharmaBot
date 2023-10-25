
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Button,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
let baseUrl = "http://127.0.0.1:5000"
function BackdropExample({ onUserLogin }) {
  const [flag,setFlag] =useState(true);
 


    const OverlayTwo = () => (
      <ModalOverlay
      
      backdropFilter='blur(10px) '
       
       
        
      />
    )
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayTwo />)

    if(!sessionStorage.getItem("user")){
    setTimeout(()=>{
      onOpen()
     },0)
    }
    let [email, setEmail ] = React.useState("")
    async function login(){
      
      let res  = await fetch(`${baseUrl}/getUserData`, {
        method: 'POST',
        body: JSON.stringify({email}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
  
      let data = await res.json();
      sessionStorage.setItem("user",JSON.stringify(data))
      onUserLogin(data); 
    }
    
    
    return (
      <>
      
          
        {/* <Button
          ml='4'
          onClick={() => {
            
            onOpen()
          }}
        >
          Use Overlay two
        </Button> */}
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <ModalHeader>sign in </ModalHeader>
            <ModalCloseButton />
            <ModalBody   >
            <Input onChange={(e)=>{setEmail(e.target.value)}} placeholder='Enter your e-mail' />
             

            </ModalBody>
            <ModalFooter>
              <Button onClick={()=>{onClose(); login() }} bgColor={"#FCEA90"} >submit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default BackdropExample;