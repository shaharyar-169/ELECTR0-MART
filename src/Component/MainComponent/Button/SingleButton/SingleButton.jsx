import React from "react";
import { Link } from "react-router-dom";


const SingleButton = React.forwardRef(({ to, text, style, onClick, id }, ref) => {
  // Get first letter and remaining text
  // const firstLetter = text.charAt(0);
  // const remainingText = text.slice(1);

  return (
    <Link to={to}>
      <button
        className="btn btn-primary"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: "12px",
          color: "rgb(230, 233, 236)",
          backgroundColor: "#186DB7",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          width: "120px",
          textAlign: "center",
          borderRadius: "5px",
          marginRight: "5px",
          textTransform: "capitalize",
          ...style,
        }}
        onClick={onClick}
        ref={ref}
        id={id}
      >
        {/* <span style={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#ffcc00'
        }}>{firstLetter}</span>
        <span>{remainingText}</span> */}
        {text}

        
      </button>

    </Link>
  );
});

// const SingleButton = React.forwardRef(
//   ({ to, text, style, onClick, id, highlightFirstLetter = false }, // Default: false
//   ref) => {
//     return (
//       <Link to={to}>
//         <button
//           className="btn btn-primary"
//           style={{
//             fontFamily: "Poppins, sans-serif",
//             fontStyle: "normal",
//             fontWeight: 400,
//             fontSize: "13px",
//             lineHeight: "12px",
//             color: "rgb(230, 233, 236)",
//             backgroundColor: "#186DB7",
//             padding: "10px 20px",
//             border: "none",
//             cursor: "pointer",
//             width: "120px",
//             textAlign: "center",
//             borderRadius: "5px",
//             marginRight: "5px",
//             textTransform: "capitalize",
//             ...style,
//           }}
//           onClick={onClick}
//           ref={ref}
//           id={id}
//         >
//           {highlightFirstLetter ? (
//             <>
//               <span style={{
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//                 color: '#ffcc00', // Yellow for first letter
//                 textDecoration:'underline'
//               }}>
//                 {text.charAt(0)}
//               </span>
//               <span>{text.slice(1)}</span>
//             </>
//           ) : (
//             text // Render normally if no highlight
//           )}
//         </button>
//       </Link>
//     );
//   }
// );

export default SingleButton;
