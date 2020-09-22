import React, { useEffect, useState, useRef } from 'react'
import moment from "moment";
import Axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { updateUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


// 지갑 주소 수정 불가하게 바꾸기
// 이메일 인증버튼 지우기


import {
    Form,
    Input,
    Button,
} from 'antd';
import { $CombinedState } from 'redux';
import { SecurityScanTwoTone, AccountBookFilled } from '@ant-design/icons';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };



  
  // 이메일 인증시 대학교 메일 형식인지 체크
  // 이메일 인증 구현 + db 수정 => 인증된 사용자만 upload 가능 수정 
  // 메타마스크 주소 유효성 검사 추가 
  // 대학교 메일 인증시에만 upload 가능하다는 안내문 -> Landing Page




function MyAccount(props) {
    const dispatch = useDispatch();
    // const [Account, setAccount] = useState([])

    const [Account, setAccount] = useState("")
    const [initialValues, setInitialValues] = useState({ name: '', email: '', wallet: ''})

        const getMyAccount = () => {
      Axios.get('/api/users/auth').then(response => {
                console.log(response.data)
                if (response.data != null) {
                        setAccount(response.data)
                } else {
                    alert('Failed to fectch Account datas')
                }
      })
    }



    useEffect(() => {
        getMyAccount()
      },[]);

      useEffect(() => {
        setInitialValues({name : Account.name,email : Account.email, wallet : Account.wallet});
      },[Account]);

    console.log(Account)

      return(
        <Formik
        enableReinitialize={true}
        initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required('Name is required'),
            email: Yup.string()
              .email('Email is invalid')
              .required('Email is required'),
            wallet: Yup.string().required('Metamask Account is required')
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
    
              let dataToSubmit = {
                email: values.email,
                id : Account._id,
                name: values.name,
                wallet: values.wallet,
                image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
              };
    
              dispatch(updateUser(dataToSubmit)).then(response => {
                if (response.payload.success) {
                  alert("회원정보 수정이 완료되었습니다")
                  props.history.push("/mypage");
                } else {
                  alert(response.payload.err.errmsg)
                }
              })
    
              setSubmitting(false);
            }, 500);
          }}
        >

          {props => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            } = props;

            return (
              <div className="app">
                <h2>My Account</h2>
                <Form style={{ minWidth: '500px' }} {...formItemLayout} onSubmit={handleSubmit} >
                  <Form.Item required label="이름">
                    <Input
                      id="name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.name && touched.name ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.name && touched.name && (
                      <div className="input-feedback">{errors.name}</div>
                    )}
                  </Form.Item>
              <Form.Item required label="이메일" hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>


              {/*  대학교 메일 형식인지 체크 필수 !!!!!!!!!!!!!!!!!!! */}
              <Form.Item {...tailFormItemLayout}> 
                  <Button style={{ float: 'right'}}>
                    <EditOutlined />
                    <a href={""}> 인증메일 전송</a> 
                    {/* <a href={`/edit/${product._id}`}>edit</a> */}
                  </Button>
              </Form.Item>

                  {/*메타주소*/}
                  <Form.Item required label="메타마스크 주소" hasFeedback validateStatus={errors.wallet && touched.wallet ? "error" : 'success'}>
                <Input
                  id="wallet"
                  placeholder="Enter your Metamask account"
                  type="text"
                  value={values.wallet}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.wallet && touched.wallet ? 'text-input error' : 'text-input'
                  }
                />
                {errors.wallet && touched.wallet && (
                  <div className="input-feedback">{errors.wallet}</div>
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                  수정 완료
                </Button>
              </Form.Item>

                </Form>
              </div>
            );
          }}
    
        </Formik>
        
      );
    };

export default MyAccount
