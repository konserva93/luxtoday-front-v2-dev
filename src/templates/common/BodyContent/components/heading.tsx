const heading = ({ value, children }: any) => {
  const Component = value.style;
  return <Component id={`id${value._key}`}>{children}</Component>
}

export default heading