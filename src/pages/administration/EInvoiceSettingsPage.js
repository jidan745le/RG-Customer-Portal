import { SaveOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Form, Input, message, Select, Spin, Switch, Tabs, TimePicker } from 'antd';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getAppConfig, updateAppConfig } from '../../services/configService';
import { uploadFile } from '../../services/fileService';
import styles from '../../styles/pages/AdministrationPage.module.css';
const { TabPane } = Tabs;
const { Option } = Select;

const EInvoiceSettingsPage = ({ title }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    // States for various form sections
    const [activeTab, setActiveTab] = useState('lookAndFeel');
    const [primaryColor, setPrimaryColor] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [serverSettings, setServerSettings] = useState({
        serverBaseAPI: '',
        companyID: '',
        userAccount: '',
        password: '',
    });
    const [taxAgencySettings, setTaxAgencySettings] = useState({
        connector: 'CN - BW',
        appKey: '',
        appSecret: '',
        salt: '',
        token: '',
        userAccount: '',
        password: '',
        baseURL: '',
        version: '',
    });
    const [processSettings, setProcessSettings] = useState({
        activateEmailNotifications: false,
        schedule: 'Weekly',
        day: 'Monday',
        time: null,
        emailAddresses: 'Lulu@nanana.com',
    });
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        taxNo: '',
        drawer: '',
        address: '',
        tel: '',
        bankName: '',
        bankAccount: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            // Get app configuration with 'einvoice' as the appcode
            const config = await getAppConfig('einvoice', "standalone");

            // Extract settings from response
            const settings = config?.settings || {};

            // Set theme settings
            if (settings.themeSetting) {
                if (settings.themeSetting.primaryColor) {
                    setPrimaryColor(settings.themeSetting.primaryColor);
                    // Set primaryColor in form
                    form.setFieldValue('primaryColor', settings.themeSetting.primaryColor);
                }
                if (settings.themeSetting.logoUrl) {
                    setLogoUrl(settings.themeSetting.logoUrl);
                    setLogoPreview(settings.themeSetting.logoUrl);
                }
            }

            // Set server settings
            if (settings.serverSettings) {
                setServerSettings(settings.serverSettings);
                form.setFieldsValue({ ...settings.serverSettings });
            }

            // Set tax agency settings
            if (settings.taxAgencySettings) {
                // 需要转换taxPassword taxUserAccount 为空
                settings.taxAgencySettings.taxPassword = settings.taxAgencySettings.password;
                settings.taxAgencySettings.taxUserAccount = settings.taxAgencySettings.userAccount;

                setTaxAgencySettings(omit(settings.taxAgencySettings, ['password', 'userAccount']));
                form.setFieldsValue({ ...omit(settings.taxAgencySettings, ['password', 'userAccount']) });
            }

            // Set process settings
            if (settings.processSettings) {
                // Convert time string to dayjs object if it exists
                const processData = { ...settings.processSettings };
                if (processData.time) {
                    processData.time = dayjs(processData.time, 'HH:mm');
                }
                setProcessSettings(processData);
                form.setFieldsValue({ ...processData });
            }

            // Set company info
            if (settings.companyInfo) {
                setCompanyInfo(settings.companyInfo);
                form.setFieldsValue({ ...settings.companyInfo });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            message.error('Failed to load E-invoice settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (color) => {
        setPrimaryColor(color.toHexString());
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Save file object for later upload
            setLogoFile(file);

            // Create local preview
            const reader = new FileReader();
            reader.onload = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Validate form
            await form.validateFields();

            // If there's a new logo file, upload it first
            let finalLogoUrl = logoUrl;
            if (logoFile) {
                setUploading(true);
                message.loading('Uploading logo...', 0);

                try {
                    finalLogoUrl = await uploadFile(logoFile, 'einvoice-logo');
                    setLogoUrl(finalLogoUrl); // Update state with new URL
                } catch (uploadError) {
                    console.error('Logo upload failed:', uploadError);
                    message.error('Logo upload failed. Settings not saved.');
                    setSaving(false);
                    message.destroy(); // Clear all messages
                    return;
                } finally {
                    setUploading(false);
                    message.destroy(); // Clear loading message
                }
            }

            // Get form values
            const formValues = form.getFieldsValue();
            console.log('提交表单数据:', formValues);

            // Prepare settings data object
            const settingsData = {
                themeSetting: {
                    primaryColor,
                    logoUrl: finalLogoUrl
                },
                serverSettings: {
                    serverBaseAPI: formValues.serverBaseAPI,
                    companyID: formValues.companyID,
                    userAccount: formValues.userAccount,
                    password: formValues.password,
                },
                taxAgencySettings: {
                    connector: formValues.connector,
                    appKey: formValues.appKey,
                    appSecret: formValues.appSecret,
                    salt: formValues.salt,
                    token: formValues.token,
                    userAccount: formValues.taxUserAccount,
                    password: formValues.taxPassword,
                    baseURL: formValues.baseURL,
                    version: formValues.version,
                },
                processSettings: {
                    activateEmailNotifications: formValues.activateEmailNotifications,
                    schedule: formValues.schedule,
                    day: formValues.day,
                    // Convert dayjs object to string format for storage
                    time: formValues.time ? formValues.time.format('HH:mm') : null,
                    emailAddresses: formValues.emailAddresses,
                },
                companyInfo: {
                    companyName: formValues.companyName,
                    taxNo: formValues.taxNo,
                    drawer: formValues.drawer,
                    address: formValues.address,
                    tel: formValues.tel,
                    bankName: formValues.bankName,
                    bankAccount: formValues.bankAccount,
                }
            };

            // 记录最终保存的数据结构，便于调试
            console.log('保存到服务器的数据:', settingsData);

            // Call API to save settings
            await updateAppConfig(settingsData, 'einvoice');

            message.success('E-invoice settings saved successfully!');

            // Clear file object since upload is complete
            setLogoFile(null);
        } catch (error) {
            console.error('Failed to save settings:', error);

            if (error.response) {
                message.error(`Failed to save: ${error.response.data.message || 'Server error'}`);
            } else {
                message.error('Failed to save settings. Please check form inputs and try again.');
            }
        } finally {
            setSaving(false);
        }
    };


    const handleRequestAuthentication = () => {
        message.loading('Requesting authentication...');
        // Get necessary fields from form
        const values = form.getFieldsValue();
        const baseURL = values.baseURL;
        const appKey = values.appKey;
        const appSecret = values.appSecret;
        const salt = values.salt || ''; // 使用用户输入的盐值
        const userAccount = values.taxUserAccount;
        const password = values.taxPassword;

        if (!baseURL || !appKey || !appSecret || !userAccount || !password) {
            message.error('Please fill in BASE URL, APP KEY, APP SECRET, User Account, and Password first');
            return;
        }

        // Encrypt password: MD5 first, then SHA-1
        const md5Password = CryptoJS.MD5(password + salt).toString(CryptoJS.enc.Hex).toLowerCase();
        const sha1Password = CryptoJS.SHA1(md5Password).toString(CryptoJS.enc.Hex);

        // Current timestamp
        const timestamp = Date.now().toString();

        // Prepare params for token request
        const params = {
            timestamp: timestamp,
            method: 'baiwang.oauth.token',
            grant_type: 'password',
            version: '6.0',
            client_id: appKey,
        };

        // Prepare body for token request
        const body = {
            password: sha1Password,
            username: userAccount,
            client_secret: appSecret
        };

        // 从localStorage获取token
        const token = localStorage.getItem('authToken');
        console.log('Authorization token from localStorage:', token);

        // 准备请求头
        const headers = {
            'Content-Type': 'application/json'
        };

        // 只有当token存在且不为空时，才添加Authorization头
        if (token && token.trim() !== '') {
            headers['authorization'] = `Bearer ${token}`;
            console.log('Adding Authorization header:', headers.Authorization);
        } else {
            console.warn('No valid token found in localStorage. Authentication header will not be included.');
            // 如果您有其他方式获取token，可以在这里添加
            // 例如：从会话存储、Cookie或其他位置获取

            // 从sessionStorage尝试获取
            const sessionToken = sessionStorage.getItem('authToken');
            if (sessionToken && sessionToken.trim() !== '') {
                headers['authorization'] = `Bearer ${sessionToken}`;
                console.log('Using token from sessionStorage instead:', headers.Authorization);
            }
        }

        // 使用后端提供的API代理接口发送请求
        axios.post('/api-proxy', {
            targetUrl: baseURL,
            method: 'POST',
            data: body,
            params: params,
            headers: headers
        }, {
            headers
        })
            .then(response => {
                console.log('API response:', response);
                if (response.data && response.data.response && response.data.response.access_token) {
                    // Set the token value in the form
                    form.setFieldValue('token', response.data.response.access_token);
                    message.success('Authentication successful!');
                } else {
                    console.error('No access_token in response:', response.data);
                    message.error('Failed to get token: No access_token in response');
                }
            })
            .catch(error => {
                console.error('Authentication request failed:', error);
                console.error('Request config:', error.config);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', error.response.data);
                }
                const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
                message.error(`Authentication failed: ${errorMsg}`);
            });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Loading E-invoice settings...</p>
            </div>
        );
    }

    console.log(primaryColor, taxAgencySettings, "primaryColor");

    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h1 className={styles.title}></h1>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsPanel}>
                    <h2 className={styles.settingsTitle}>{title}</h2>

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            ...serverSettings,
                            ...taxAgencySettings,
                            ...processSettings,
                            ...companyInfo,
                            primaryColor: primaryColor,
                        }}
                    >
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            tabPosition="left"
                            className={styles.settingsTabs}
                            destroyInactiveTabPane={false}
                        >
                            {/* Look & Feel Tab */}
                            <TabPane tab="Look & Feel" key="lookAndFeel" forceRender={true}>
                                <div className={styles.settingSection}>
                                    <h3>Theme</h3>
                                    <Form.Item
                                        label="Primary Color"
                                        name="primaryColor"
                                        initialValue={primaryColor}
                                    >
                                        <ColorPicker
                                            format="hex"
                                            showText
                                            value={primaryColor}
                                            onChange={(color, hex) => {
                                                const hexColor = color.toHexString();
                                                console.log(hexColor, "hexColor");
                                                setPrimaryColor(hexColor);
                                                form.setFieldValue('primaryColor', hexColor);
                                            }}
                                            presets={[
                                                {
                                                    label: 'Recommended',
                                                    colors: [
                                                        '#1a3a6c', '#000000', '#2b6989', '#3a5998',
                                                        '#71c5fb', '#b8daff', '#843c39', '#ff9b9b',
                                                        '#ffd5d1', '#d9d9d9', '#e6e6e6'
                                                    ],
                                                },
                                            ]}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Logo"
                                        name="logo"
                                    >
                                        <div className={styles.logoUpload}>
                                            <label htmlFor="einvoice-logo-upload" className={styles.uploadButton}>
                                                Upload Logo
                                            </label>
                                            <input
                                                id="einvoice-logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className={styles.fileInput}
                                                style={{ display: 'none' }}
                                            />
                                            <div className={styles.logoPreview}>
                                                {logoPreview ? (
                                                    <img
                                                        src={logoPreview.startsWith('data') ? logoPreview : `/api/${logoPreview}`}
                                                        alt="E-invoice logo"
                                                        className={styles.logoImage}
                                                    />
                                                ) : (
                                                    <div className={styles.emptyLogo} />
                                                )}
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                            </TabPane>

                            {/* Server Settings Tab */}
                            <TabPane tab="Server Settings" key="serverSettings" forceRender={true}>
                                <div className={styles.settingSection}>
                                    <h3>ERP Server Settings</h3>
                                    <Form.Item
                                        label="Server Base API"
                                        name="serverBaseAPI"
                                        rules={[{ required: true, message: 'Please enter the server base API' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Company ID"
                                        name="companyID"
                                        rules={[{ required: true, message: 'Please enter the company ID' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="User Account"
                                        name="userAccount"
                                        rules={[{ required: true, message: 'Please enter the user account' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please enter the password' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>


                                </div>

                                <div className={styles.settingSection}>
                                    <h3>Tax Agency Settings</h3>
                                    <Form.Item
                                        label="Connector"
                                        name="connector"
                                        rules={[{ required: true, message: 'Please select a connector' }]}
                                    >
                                        <Select>
                                            <Option value="CN - BW">CN - BW</Option>
                                            <Option value="ML - Manual">ML - Manual</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="APP KEY"
                                        name="appKey"
                                        rules={[{ required: true, message: 'Please enter the APP KEY' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="APP SECRET"
                                        name="appSecret"
                                        rules={[{ required: true, message: 'Please enter the APP SECRET' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="Salt Value"
                                        name="salt"
                                        tooltip="Optional salt value used for password encryption"
                                    >
                                        <Input placeholder="Enter salt value for password encryption" />
                                    </Form.Item>

                                    <Form.Item
                                        label="TOKEN"
                                        name="token"
                                    >
                                        <Input
                                            disabled
                                            placeholder="Read only"
                                            addonAfter={
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    onClick={handleRequestAuthentication}
                                                    style={{ margin: -7 }}
                                                >
                                                    Get Token
                                                </Button>
                                            }
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="User Account"
                                        name="taxUserAccount"
                                        rules={[{ required: true, message: 'Please enter the user account' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="taxPassword"
                                        rules={[{ required: true, message: 'Please enter the password' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="BASE URL"
                                        name="baseURL"
                                        rules={[{ required: true, message: 'Please enter the BASE URL' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Version"
                                        name="version"
                                        rules={[{ required: true, message: 'Please enter the version' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                </div>
                            </TabPane>

                            {/* Process Tab */}
                            <TabPane tab="Process" key="process" forceRender={true}>
                                <div className={styles.settingSection}>
                                    <h3>Schedule</h3>
                                    <Form.Item
                                        label="Activate email Notifications"
                                        name="activateEmailNotifications"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        label="Schedule"
                                        name="schedule"
                                        rules={[{ required: true, message: 'Please select a schedule' }]}
                                    >
                                        <Select>
                                            <Option value="Weekly">Weekly</Option>
                                            <Option value="Monthly">Monthly</Option>
                                            <Option value="Daily">Daily</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Day"
                                        name="day"
                                        rules={[{ required: true, message: 'Please select a day' }]}
                                    >
                                        <Select>
                                            <Option value="Monday">Monday</Option>
                                            <Option value="Tuesday">Tuesday</Option>
                                            <Option value="Wednesday">Wednesday</Option>
                                            <Option value="Thursday">Thursday</Option>
                                            <Option value="Friday">Friday</Option>
                                            <Option value="Saturday">Saturday</Option>
                                            <Option value="Sunday">Sunday</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Time"
                                        name="time"
                                        rules={[{ required: true, message: 'Please select a time' }]}
                                    >
                                        <TimePicker format="HH:mm" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email Addresses"
                                        name="emailAddresses"
                                        rules={[{ required: true, message: 'Please enter email addresses' }]}
                                    >
                                        <Input placeholder="Comma-separated email addresses" />
                                    </Form.Item>
                                </div>
                            </TabPane>

                            {/* Authentication Tab */}
                            <TabPane tab="Authentication" key="authentication" forceRender={true}>
                                <div className={styles.settingSection}>
                                    <h3>Tax Agency</h3>
                                    <Button
                                        type="primary"
                                        onClick={handleRequestAuthentication}
                                    >
                                        Request Authentication
                                    </Button>
                                </div>
                            </TabPane>

                            {/* Company Information Tab */}
                            <TabPane tab="Company Information" key="companyInfo" forceRender={true}>
                                <div className={styles.settingSection}>
                                    <h3>My Company</h3>
                                    <Form.Item
                                        label="Company Name"
                                        name="companyName"
                                        rules={[{ required: true, message: 'Please enter your company name' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Tax No"
                                        name="taxNo"
                                        rules={[{ required: true, message: 'Please enter your tax number' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Drawer"
                                        name="drawer"
                                        rules={[{ required: true, message: 'Please enter the drawer' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Address"
                                        name="address"
                                        rules={[{ required: true, message: 'Please enter your address' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Tel"
                                        name="tel"
                                        rules={[{ required: true, message: 'Please enter your telephone' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Bank Name"
                                        name="bankName"
                                        rules={[{ required: true, message: 'Please enter your bank name' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Bank Account"
                                        name="bankAccount"
                                        rules={[{ required: true, message: 'Please enter your bank account' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </TabPane>
                        </Tabs>

                        <div className={styles.actionButtons}>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                size="large"
                                loading={saving || uploading}
                                disabled={uploading}
                            >
                                {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Settings'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EInvoiceSettingsPage; 