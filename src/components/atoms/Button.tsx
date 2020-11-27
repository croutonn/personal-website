interface IButtonProps {
  text: string
}

const Button: React.FunctionComponent<IButtonProps> = (props) => (
  <button type="button">{props.text}</button>
)

export default Button
