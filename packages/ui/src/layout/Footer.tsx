interface I_FooterProps {
    appName: string
}

export const Footer = ({ appName }: I_FooterProps) => {
    return (
        <div className="footer-wrapper">
            <h3 className="footer-app-name">{appName}</h3>
            <p className="footer-copyright">{`@copyright ${appName.toLowerCase().trim()} ${new Date().getFullYear()}`}</p>
        </div>
    )
}
