// import React from 'react';
// import { logoStyles as s } from '../../assets/dummyStyles';
// import { Link } from 'react-router-dom';
// import { HiOutlineLibrary } from 'react-icons/hi';

// const Logo=({frontSize="1.5rem",
//    iconSize=24,
//    showText=true,
//    ...props

// })=>{

//    return (
//    <link to='/'className={`${props.className || ""}`}
//    style={{fontSize,...props.style}}
//    >
//       <div className={s.iconWrapper}>
//          <HiOutlineLibrary size={iconSize}/>
//       </div>
//       {showText && <span className={s.text}>RealEState</span>}
//    </link>
//    );
// };
// export default Logo;




import React from 'react';
import { logoStyles as s } from '../../assets/dummyStyles';
import { Link } from 'react-router-dom';
import { HiOutlineLibrary } from 'react-icons/hi';

const Logo = ({
  fontSize = "1.5rem",      // ✅ 'frontSize' → 'fontSize' (CSS property)
  iconSize = 24,
  showText = true,
  ...props
}) => {
  return (
    <Link
      to="/"
      className={`${props.className || ""}`}
      style={{ fontSize, ...props.style }}   // ✅ 'fontSize' defined now
    >
      <div className={s.iconWrapper}>
        <HiOutlineLibrary size={iconSize} />
      </div>
      {showText && <span className={s.text}>RealEState</span>}
    </Link>
  );
};

export default Logo;