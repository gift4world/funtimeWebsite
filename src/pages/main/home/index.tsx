import React, {useEffect, useState} from 'react';
import Slide from "@/basicComponent/Slide";
import {getHomePageData} from "@/api/v1/home";
import Loading from "@/basicComponent/Loading";
import {useHistory} from "react-router-dom";
import List from "@/pages/main/home/list";
import useGetNameList from "@/customHook/useGetNameList";
import {useClearKeepalive} from "@/customHook/useKeepaliveNameControl";
import UserList from "@/pages/main/home/userList";
import TopicList from "@/pages/main/home/topicList";
import NoticeModal from "@/pages/main/home/noticeModal";
import Footer from "@/pages/main/publicComponent/footer";

import "./index.less";

const Index = () => {
    const nameList = useGetNameList()

    const [data, setData] = useState({} as { [key: string]: any })

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)

    const history = useHistory()

    useClearKeepalive()

    useEffect(() => {
        document.body.scrollTo({top:0})
        setLoadingVisible(true)
        getHomePageData().then(res => {
            res.status === 200 && setData(res.data)
            sessionStorage.setItem("friendLink", JSON.stringify(res.data.friendLink))
            sessionStorage.setItem("describe", JSON.stringify(res.data.describe))
            sessionStorage.setItem("copyright", JSON.stringify(res.data.copyright))
            setLoadingVisible(false)
        })
    }, [])

    const {
        bannerList, noticeList, signList,
        popularCommunity, popularIntroduction,
        activeUser, activeTopic, nominateUser,
        nominateCommunity
    } = data

    const {mainImg, address, mainTitle, subTitle} = signList?.length > 0 && signList[0]

    const {server, area, role, career} = nameList

    return (
        <React.Fragment>
            {Object.keys(data).length > 0 && <div className="home-container">
                <div className="slogan-and-sign">
                    <div className="slogan-container">
                        <div className="slogan">
                            Fun Time
                        </div>
                        <div>
                            <span>FF14??????</span>
                            <span>????????????</span>
                        </div>
                        <div>???????????????:{mainTitle}</div>
                        <div>???????????????:{subTitle}</div>
                    </div>
                    <div className="sign-container">
                        <img onClick={() => {
                            history.push(address)
                        }} src={mainImg} alt="img"/>
                    </div>
                </div>
                <Slide
                    mainTitleFontSize={"3rem"}
                    subTitleFontSize={"1.6rem"}
                    data={bannerList}
                    thumbnailPosition={"flex-end"}
                    minWidth={"30rem"}
                    delay={5000}
                    margin={"0 0 1rem 0"}
                    height={"20rem"}
                />
                <div className="home-page-label">
                    <div>??????????????????</div>
                </div>
                <div className="active-user">
                    <UserList userList={activeUser}/>
                </div>
                <div className="home-page-label">
                    <div>??????????????????</div>
                </div>
                <div className="active-user">
                    <TopicList topicList={activeTopic}/>
                </div>
                <div className="home-page-label">
                    <div>????????????</div>
                    <div className="click" onClick={() => {
                        setModalVisible(true)
                    }}>????????????
                    </div>
                </div>
                <div className="notice-container">
                    <List model={"notice"} list={noticeList}/>
                </div>
                <div className="home-page-label">
                    <div>???????????????????????????</div>
                </div>
                <div className="popular-community">
                    <List model={"community"} list={popularCommunity}/>
                </div>
                <div className="home-page-label">
                    <div>??????????????????????????????</div>
                </div>
                <div className="popular-introduction">
                    <List
                        model={"introduction"}
                        list={popularIntroduction}
                        serverList={server}
                        areaList={area}
                        careerList={career}
                        roleList={role}
                    />
                </div>
                <Footer/>
            </div>}
            <NoticeModal visible={modalVisible} setVisible={setModalVisible}/>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
}

export default Index;