import { OPERATIVE_MANAGER_ROLE } from '../utils/user'

const HomePage = () => {
  return (
    <>
      <section className="section">
        <h1 className="lbh-heading-h1">Find operatives</h1>
      </section>
    </>
  )
}

HomePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default HomePage
