import {OrganizationProfile} from "@clerk/nextjs";

const SettingsPage = () => {
    return (
        <div>
            {/*TODO: Доразобраться по стилям компонента (удалить тень и изменить размер)*/}
            <OrganizationProfile
                routing="hash"
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width: "100%",
                        },
                        card: {
                            border: "1px solid #e5e5e5",
                            boxShadow: "none",
                        }
                    }
            }}/>
        </div>
    )
}

export default SettingsPage;