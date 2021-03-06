import React, {useEffect, useMemo, useRef, useState} from 'react';
import FieldsetContainer from "@/pages/main/userCenter/publicComponent/fieldsetContainer";
import WithLabel from './publicComponent/withLabel';
import Button from "@/basicComponent/Button";
import {Form, FormItem} from "@/basicComponent/Form";
import TiledSelectedList from "@/pages/main/userCenter/introoductionCom/tiledSelectedList";
import Upload from "@/basicComponent/Upload";
import useLocalStorage from "@/customHook/useLocalStorage";
import Loading from "@/basicComponent/Loading";
import {showToast} from "@/utils/lightToast";
import useUploadImg from "@/customHook/useUploadImg";
import {editPersonalHomeSetting, getPersonalHomeSetting} from "@/api/v1/personalHome";
import Selector from '@/basicComponent/Selector';

import "./introduction.less";

const PersonalHomeSetting = () => {
    const [data, setData] = useState({
        id: 0,
        showGameInfo: 0,
        showJoinActivity: 0,
        showCommunity: 0,
        showComment: 0,
        showReply: 0,
        maxCommunityTotal: 10,
        backgroundImg: ""
    })

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const userId = getLocalStorage("userId")

    const uploadImg = useUploadImg()

    const formRef = useRef(null)

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        setLoadingVisible(true)
        getPersonalHomeSetting({userId}).then(res => {
            setLoadingVisible(false)
            res.status === 200 && setData(res.data)
        })
    }

    const submit = (value: any) => {
        const {
            warning, backgroundImg, maxCommunityTotal,
            showGameInfo, showJoinActivity, showCommunity,
            showComment, showReply
        } = value
        if (!warning) {
            const fetchData = {
                showGameInfo: showGameInfo.id,
                showJoinActivity: showJoinActivity.id,
                showCommunity: showCommunity.id,
                showComment: showComment.id,
                showReply: showReply.id,
                maxCommunityTotal: Number(maxCommunityTotal),
                backgroundImg,
                id: data.id
            }
            backgroundImg.length > 0 && uploadImg(backgroundImg, (result) => {
                fetchData.backgroundImg = result[0]
                editPersonalHomeSetting(fetchData).then(res => {
                    if (res.status === 200) {
                        showToast("????????????")
                        // getData()
                    }
                })
            })
        }
    }

    const totalSetting = [{
        name: "6???",
        data: 6,
    }, {
        name: "12???",
        data: 12,
    }, {
        name: "18???",
        data: 18,
    }]

    const condition = [{id: 0, name: "???"}, {id: 1, name: "???"}]

    const {
        showGameInfo, showJoinActivity,
        showCommunity, showComment,
        showReply, maxCommunityTotal,
        backgroundImg
    } = data

    const formList = useMemo(() => {
        return [{
            name: "showGameInfo",
            data: showGameInfo,
            label: "??????????????????",
            tips: "???????????????????????????"
        }, {
            name: "showJoinActivity",
            data: showJoinActivity,
            label: "?????????????????????",
            tips: "??????????????????????????????"
        }, {
            name: "showCommunity",
            data: showCommunity,
            label: "??????????????????",
            tips: "???????????????????????????"
        }, {
            name: "showComment",
            data: showComment,
            label: "??????????????????",
            tips: "???????????????????????????"
        }, {
            name: "showReply",
            data: showReply,
            label: "??????????????????",
            tips: "???????????????????????????"
        }]
    }, [data])

    return (
        <div className="user-center-introduction-container">
            <FieldsetContainer title={"??????????????????"}>
                <Form
                    ref={formRef}
                    reload={[showGameInfo, showJoinActivity,
                        showCommunity, showComment,
                        showReply, maxCommunityTotal,
                        backgroundImg]}
                    onFinish={submit}
                >
                    <FormItem
                        label={"maxCommunityTotal"}
                        name={"maxCommunityTotal"}
                        reload={[maxCommunityTotal]}
                        condition={{
                            required: {value: true, tips: "????????????????????????"},
                        }}
                    >
                        <WithLabel label={"??????????????????"} formItemModel={true}>
                            <Selector
                                returnString={true}
                                options={totalSetting}
                                returnValueKey={"data"}
                                labelKey={"name"}
                                initializeValue={maxCommunityTotal}
                                placeholder={"????????????"}
                            />
                        </WithLabel>
                    </FormItem>
                    <FormItem
                        label={"backgroundImg"}
                        name={"backgroundImg"}
                        reload={[backgroundImg]}
                        condition={{
                            required: {value: true, tips: "??????????????????"},
                        }}
                    >
                        <WithLabel label={"?????????"} formItemModel={true}>
                            <Upload
                                initializeFileUrlList={backgroundImg && [backgroundImg]}
                                maxFileLength={1}
                                acceptFileType={"image/png,image/jpeg"}
                            />
                        </WithLabel>
                    </FormItem>
                    {formList.map((item, index) => {
                        const {name, data, label, tips} = item
                        return <FormItem
                            key={index}
                            label={name}
                            name={name}
                            reload={[data]}
                            condition={{
                                required: {value: true, tips},
                            }}
                        >
                            <WithLabel label={label} formItemModel={true}>
                                <TiledSelectedList
                                    list={condition}
                                    initializeData={{id: data}}
                                />
                            </WithLabel>
                        </FormItem>
                    })}
                    <FormItem
                        style={{
                            margin: "1rem 1rem 1rem auto",
                            width: "25%",
                            minWidth: "15rem",
                        }}
                    >
                        <Button type={"submit"}>
                            ??????
                        </Button>
                    </FormItem>
                </Form>
            </FieldsetContainer>
            <div className="user-center-introduction-action-group">

            </div>
            <Loading visible={loadingVisible}/>
        </div>
    );
};

export default PersonalHomeSetting;