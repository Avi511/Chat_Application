interface LoginFormProps {
    onLogin: () => void;
}


const LoginForm = ({ onLogin }: LoginFormProps) => {
    return (
        <div>
            <h1>Login</h1>
        </div>
    );
};

export default LoginForm;