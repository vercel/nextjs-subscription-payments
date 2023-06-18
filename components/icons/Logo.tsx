const Logo = ({ className = '', ...props }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
  <circle className="cls-1 fill-[#33bbcf]" cx="60.43" cy="59.52" r="53" transform="translate(-18.18 27.66) rotate(-22.5)"/>
  <path d="M60.43,8.52a51,51,0,1,1-51,51,51.06,51.06,0,0,1,51-51m0-4a55,55,0,1,0,55,55,55,55,0,0,0-55-55Z"/>
  <rect className="cls-2 fill-[#fff] stroke-black stroke-[4px]" x="18.43" y="41.52" width="84" height="40" rx="11.48"/>
  <polyline style={{strokeMiterlimit:10}} className="cls-3 fill-none stroke-black stroke-[4px]" points="25.87 67.65 39.99 53.52 54.52 68.05"/>
  <polyline style={{strokeMiterlimit:10}} className="cls-3 fill-none stroke-black stroke-[4px]" points="62.87 54.92 76.99 69.05 91.52 54.52"/>
  </svg>
);

export default Logo;
