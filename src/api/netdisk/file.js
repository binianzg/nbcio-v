// 文件模块相关接口
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import Vue from 'vue'

/**
 * 获取文件列表相关接口
 */
// 获取文件列表（区分文件路径）
export const getFileListByPath = (params) => getAction('/nd/ndFile/getfilelist', params)
// 获取文件列表（区分文件类型）
export const getFileListByType = (params) => getAction('/nd/ndFile/selectfilebyfiletype', params)
// 获取回收站文件列表
export const getRecoveryFile = (params) => getAction('/nd/ndRecoveryfile/list', params)
// 获取我已分享的文件列表
export const getMyShareFileList = (params) => getAction('/nd/ndShare/shareList', params)
// 获取存储占用
export const getStorage = (params) => getAction('/nd/ndStorage/getstorage', params)
// 获取文件目录树
export const getFoldTree = (params) => getAction('/nd/ndFile/getfiletree', params)

/**
 * 单文件操作相关接口
 */
// 创建文件夹
export const createFold = (params) => postAction('/nd/ndFile/createFold', params)
// 获取文件详细信息
export const getFileDetail = (params) => getAction('/nd/ndFile/detail', params)
// 删除文件
export const deleteFile = (params) => postAction('/nd/ndFile/deleteFile', params)
// 复制文件
export const copyFile = (params) => postAction('/nd/ndFile/copyfile', params)
// 移动文件
export const moveFile = (params) => postAction('/nd/ndFile/movefile', params)
// 重命名文件
export const renameFile = (params) => postAction('/nd/ndFile/renamefile', params)
// 解压文件
export const unzipFile = (params) => postAction('/nd/ndFile/unzipfile', params)
// 全局搜索文件
export const searchFile = (params) => getAction('/nd/ndFile/search', params)
// 分享文件
export const shareFile = (params) => postAction('/nd/ndShare/shareFile', params)
// 校验分享链接过期时间
export const checkShareLinkEndtime = (params) => getAction('/nd/ndShare/checkendtime', params)
// 校验分享链接是否需要提取码
export const checkShareLinkType = (params) => getAction('/nd/ndShare/sharetype', params)
// 校验分享链接提取码是否正确
export const checkShareLinkCode = (params) => getAction('/nd/ndShare/checkextractioncode', params)
// 获取分享文件列表
export const getShareFileList = (params) => getAction('/nd/ndShare/sharefileList', params)
// 保存分享文件
export const saveShareFile = (params) => postAction('/nd/ndShare/savesharefile', params)

/**
 * 文件批量操作相关接口
 */
// 批量删除文件
export const batchDeleteFile = (params) => postAction('/nd/ndFile/batchdeletefile', params)
// 批量移动文件
export const batchMoveFile = (params) => postAction('/nd/ndFile/batchmovefile', params)

/**
 * 回收站文件操作相关接口
 */
// 回收站文件删除
export const deleteRecoveryFile = (params) =>
	postAction('/nd/ndRecoveryfile/deleterecoveryfile', params)
// 回收站文件还原
export const restoreRecoveryFile = (params) => postAction('/nd/ndRecoveryfile/restorefile', params)
// 回收站文件批量删除
export const batchDeleteRecoveryFile = (params) =>
	postAction('/nd/ndRecoveryfile/batchdelete', params)

/**
 * 文件公共接口
 */
// 文件预览
export const getFilePreview = (params) => getAction('/nd/ndStorage/preview', params)
// 文件修改
export const modifyFileContent = (params) => postAction('/nd/ndFile/update', params)

/**
 * 底部信息栏
 */
// 查询系统参数组
export const getParamsDetail = (params) => getAction('/param/grouplist', params)

// 创建文档
export const createOfficeFile = (params) => postAction('/nd/ndFile/createFile', params)
// 编辑文档
export const editOfficeFile = (params) => postAction('/office/editofficefile', params)
// 查看文档
export const previewOfficeFile = (params) => postAction('/office/previewofficefile', params)
