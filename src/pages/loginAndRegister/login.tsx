import React, {useEffect, useState} from 'react';
import {Form, FormItem} from '@/basicComponent/Form';
import {RouteComponentProps, useHistory} from "react-router-dom";

import Input from '@/basicComponent/Input';
import {showToast} from '@/utils/lightToast';
import Verification from './verification';
import Button from '@/basicComponent/Button';
import {SLink} from '@/utils/routerRender';
import {userLogin} from "@/api/v1/loginAndRegister";
import LayoutContainer from "@/basicComponent/LayoutContainer";
import Radio from "@/basicComponent/Radio";
import {confirm} from "@/basicComponent/Confirm";
import {useAliveController} from "react-activation";

import "./login.less";

export const userLoginFunc = (
    account: string, password: string, isRemember: boolean,
    history: RouteComponentProps["history"], isAutoLogin: number = 0,
    setLoadingVisible?: (bool: boolean) => void
) => {
    userLogin({username: account, password, isAutoLogin}).then(res => {
        if (res.status === 200) {
            const userInfo = res.userInfo
            const userId = res.userInfo.id
            const token = res.token
            const timeStamp = String(new Date())
            if (isRemember) {
                localStorage.setItem("password", password)
            }
            localStorage.setItem("userId", userId)
            localStorage.setItem("loginTime", String(Date.parse(timeStamp)))
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            localStorage.setItem("token", token)
            setLoadingVisible && setLoadingVisible(false)
            history.goBack()
        } else {
            setLoadingVisible && setLoadingVisible(false)
        }
    })
}

export const Login = () => {

    const [isVerify, setIsVerify] = useState(false)

    const [isRemember, setIsRemember] = useState(false)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [formRef, setFormRef] = useState("" as any)

    const history = useHistory()

    const {clear} = useAliveController()

    const regexp = new RegExp(/[A-Za-z0-9]+/)

    //??????????????????
    useEffect(() => {
        clear()
    }, [])

    const onFinish = (value: any) => {
        const {warning, account, password} = value
        if (!isVerify) {
            showToast("????????????????????????", "error")
            return
        }
        if (warning) {
            showToast("??????????????????????????????????????????", "error")
        } else {
            setLoadingVisible(true)
            userLoginFunc(account, password, isRemember, history, 0, setLoadingVisible)
        }
    }

    return (
        <LayoutContainer
            backgroundTips={true}
            loadingVisible={loadingVisible}
        >
            <Form
                onFinish={onFinish}
                ref={(el) => setFormRef(el)}
            >
                <FormItem
                    label={"account"}
                    name={"account"}
                    style={{margin: "0 0 2rem 0"}}
                    condition={{
                        required: {value: true, tips: "?????????????????????"},
                        max: {value: 10, tips: "??????????????????10??????"},
                        min: {value: 6, tips: "?????????6??????"},
                    }}
                >
                    <Input
                        regexp={new RegExp(/^[A-Za-z0-9]+$/)}
                        matchAll={true}
                        noFocusStyle={true}
                        initializeValue={""}
                        placeholder={"??????"}
                        autocomplete="username text"
                    />
                </FormItem>
                <FormItem
                    label={"password"}
                    name={"password"}
                    style={{margin: "2rem 0"}}
                    condition={{
                        required: {value: true, tips: "?????????????????????"},
                        max: {value: 15, tips: "??????????????????15??????"},
                        min: {value: 8, tips: "?????????8??????"},
                    }}
                >
                    <Input
                        regexp={new RegExp(/^[A-Za-z0-9]+$/)}
                        matchAll={true}
                        noFocusStyle={true}
                        type="password"
                        initializeValue={""}
                        placeholder={"??????"}
                        autocomplete="password text"
                    />
                </FormItem>
                <FormItem
                    label={"verification"}
                    name={"verification"}
                >
                    {/*?????????????????????FormItem?????????ref*/}
                    <div className="login-verification">
                        <Verification
                            width={"100%"}
                            height={"4rem"}
                            successCallBack={() => {
                                setIsVerify(true)
                            }}
                            status={isVerify}
                        />
                    </div>
                </FormItem>
                <FormItem
                    style={{margin: "1rem 0"}}
                >
                    <Button type={"submit"}>??????</Button>
                </FormItem>
            </Form>
            <div className="login-action-container">
                <span><Radio onChange={(bool) => {
                    bool && confirm({
                        title: "??????",
                        content: "???????????????????????????????????????localStorage??????????????????",
                        onClick: () => {
                            setIsRemember(bool as boolean)
                        },
                        onCancel: () => {
                        },
                        onClickText: "??????",
                        onCancelText: "??????"
                    })
                }} width={"100%"} alignItems={"center"} size={"small"}>
                    ?????????
                </Radio></span>
                <span>?????????????<SLink to={"/register"}>?????????</SLink></span>
                <span><SLink to={"/resetPassword"}>?????????????</SLink></span>
            </div>
        </LayoutContainer>
    );
};