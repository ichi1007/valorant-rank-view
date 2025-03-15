import React from "react";

declare global {
  namespace JSX {
    // Using type instead of interface to avoid the "equivalent to supertype" error
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}
