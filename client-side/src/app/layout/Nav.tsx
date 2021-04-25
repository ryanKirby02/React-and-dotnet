
//Semantic ui
import { Button, Container, Menu } from "semantic-ui-react"

interface Props {
    openForm: () => void;
}

const Nav = ({openForm}: Props) => {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}} />
                    React and DotNet
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button onClick={openForm} positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default Nav
