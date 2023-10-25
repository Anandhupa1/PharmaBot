// src/chakra.js
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import * as React from "react";

function Chakra() {
  return (
    <ChakraProvider>
      <CSSReset />
      {/* Your app components will go here */}
    </ChakraProvider>
  );
}

export default Chakra;
