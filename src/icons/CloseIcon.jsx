function CloseIcon(props) {
  const { fill } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ionicon"
      viewBox="0 0 512 512">
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        fill="none"
        stroke={fill}
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M320 320L192 192M192 320l128-128"
      />
    </svg>
  );
}

export default CloseIcon;
