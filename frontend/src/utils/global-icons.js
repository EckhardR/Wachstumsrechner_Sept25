import { AiOutlineApartment, AiOutlineCloudUpload, AiOutlineCodeSandbox, AiOutlineStop, AiTwotoneDelete } from 'react-icons/ai/index.esm.js';
import { GiMuscleUp, GiNotebook, GiWeight } from 'react-icons/gi/index.esm.js';
import { GrCatalog, GrDocumentPdf, GrUserWorker } from 'react-icons/gr/index.esm.js';
import { IoIosNotifications } from 'react-icons/io/index.esm.js';
import { TbEdit, TbError404Off, TbLayersDifference, TbZoomQuestion } from 'react-icons/tb/index.esm.js';
import { BsGraphUpArrow, BsReply, BsReplyAllFill } from 'react-icons/bs/index.esm.js';
import { FaBalanceScale, FaHeadSideVirus, FaRegSave,  FaSignOutAlt, FaUserCog, FaTasks } from 'react-icons/fa/index.esm.js';
import { FcApproval, FcAreaChart, FcLineChart, FcAssistant, FcAddDatabase, FcCancel, FcCheckmark, FcExport, FcFilm, FcInTransit, FcReading, FcSettings, FcViewDetails, FcDepartment, FcRuler, FcOrganization, FcBarChart } from 'react-icons/fc/index.esm.js';
import { MdChildCare,  MdOutlineBedroomChild, MdOutlineDifference, MdOutlinePlace, MdOutlineRunningWithErrors, MdOutlineTimer } from 'react-icons/md/index.esm.js';
import { RiArchiveDrawerLine } from 'react-icons/ri/index.esm.js';
import { BiBarcodeReader, BiCategoryAlt, BiDownload, BiHistory, BiImage, BiPackage, BiPlayCircle, BiShowAlt } from 'react-icons/bi/index.esm.js';
import { VscDebugRestart } from 'react-icons/vsc/index.esm.js';
import { PiPersonArmsSpreadLight } from 'react-icons/pi/index.esm.js';
import { IoSend } from 'react-icons/io5';
import { ButtonCancel, ButtonFirst } from './global-variables';
import { FaUserCircle, FaSave, FaRegFileCode, FaLanguage } from "react-icons/fa";
import { PiUserList } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { BiLogoMicrosoftTeams, BiSolidUserDetail } from "react-icons/bi";
import {
  RiVipFill,
  RiUserStarLine,
  RiUser6Line,
  RiUserLocationLine,
  RiSignalWifiOffLine,
  RiLockPasswordFill,
} from "react-icons/ri";
import { GrSend } from "react-icons/gr";
import { IoIosSettings } from "react-icons/io";
import { VscServerProcess } from "react-icons/vsc";
import { CgDetailsMore } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";

export const DoneIcon = <FcApproval size={25} color='#00D084' />;
export const FertigIcon = <FcCheckmark size={25} color='#00D084' />;
export const NotificationIcon = <IoIosNotifications size={25} color='#FCB900' />;
export const BuchIcon = <GrCatalog size={25} color='#0693E3' className='ml-2' />;
export const QuestionIcon = <TbZoomQuestion size={25} color='#0693E3' />;
export const ReplayIcon = <BsReplyAllFill size={25} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const ReadIcon = <FcReading size={25} color='#FCB900' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const SaveIcon = <FaRegSave size={25} color='#FCB900' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const BookingIcon = <GiNotebook size={25} color='#0693E3' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const ArchivIcon = <RiArchiveDrawerLine size={25} color='#0693E3' />;
export const OffenIcon = <MdOutlineTimer color='#FF6900' />;
export const ReplayFormIcon = <BsReply size={25} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const ArbeitsplatzIcon = <MdOutlinePlace size={25} color='#0693E3' />;
export const UserIcon = <GrUserWorker size={25} color='#0693E3' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const VerlaufIcon = <BiHistory size={25} color='#FCB900' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const KommunicationsIcon = <FcAssistant size={25} color='#0693E3' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const ErrorIcon = <TbError404Off size={25} color='#eb144c' />;
export const CategoryIcon = <BiCategoryAlt size={25} color='#0693E3' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const WeightIcon = <GiWeight size={25} color='#0693E3' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const DifferenceIcon = <MdOutlineDifference size={20} color='#FFFFFF' />;
export const DeviationIcon = <FcBarChart size={20} color='#FFFFFF' />;

export const logoutIcon = <CiLogout size={25}  />;
export const userSettingIcon = (
    <FaUserCog size={25} />
  );

export const WithoutIcon = <MdOutlineRunningWithErrors size={25} color='#eb144c' />;
export const ExportIcon = <FcExport size={25} color='#eb144c' />;
export const AbteilungIcon = <AiOutlineApartment size={25} color='#0693E3' />;
export const BildIcon = <BiImage size={25} color='#0693E3' />;
export const DetailsIcon = <FcViewDetails size={25} color='#0693E3' />;
export const DeletIcon = <AiTwotoneDelete size={25} color='#EB144C' />;
export const TransportIcon = <FcInTransit size={25} color='#0693E3' />;
export const RestIcon = <VscDebugRestart size={25} color='#0693E3' />;
export const CancelIcon = <FcCancel size={25} color='#0693E3' />;
export const LabelIcon = <BiBarcodeReader size={25} color='#0693E3' />;
export const StartIcon = <BiPlayCircle size={25} color='#0693E3' />;
export const StopIcon = <AiOutlineStop size={25} color='#eb144c' />;
export const EditIcon = <TbEdit color='#0693E3' />;
export const PdfIcon = <GrDocumentPdf size={25} color='#800080' />;
export const OpenIcon = <BiShowAlt size={25} color='#0693E3' />;
export const UploadIcon = <AiOutlineCloudUpload size={25} color='#0693E3' />;
//export const SettingIcon = <FcSettings size={25} color='#0693E3' />;
export const NewKidIcon = <MdChildCare size={25} color='#0693E3' />;
export const newElemenetIcon = <FcAddDatabase size={25} color='#0693E3' />;
export const departemenetIcon = <FcDepartment size={25} color='#0693E3' />;
export const graphIcon = <BsGraphUpArrow color='#0693E3' />;

export const tasksIcon = <FaTasks color='#0693E3' />; 
export const dischargeIcon = <FaSignOutAlt color='#EB144C' />;
export const HeadCircumferenceIcon = <FaHeadSideVirus size={20} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const LengthIcon = <FcRuler size={25} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const downloadIcon = <BiDownload size={25} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const fatMassIcon = <GiMuscleUp  size={20} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const fatFreeMass = <PiPersonArmsSpreadLight  size={20} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const FatAdjIwtIcon = <FcAreaChart  size={20} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;
export const DevFatAdjIwtIcon = <FcLineChart size={20} color='#FFFFFF' style={{ stroke: "black", strokeWidth: ".2" }} />;

export const bedIcon = <MdOutlineBedroomChild size={25} color='#0693E3'  />;


export const ClinicIcon = <FcOrganization size={25}  />;
export const StationIcon = <FcOrganization size={25}  />;


export const SendIcon = ({ color = ButtonFirst, size = 30 }) => (
  <IoSend size={size} color={color} />
);

export const SettingIcon = ({ color='#FFFFFF', size = 30 }) => (
  <IoIosSettings size={size} color={color} style={{ stroke: "black", strokeWidth: ".2" }} />
);

export const UserSettingIcon = ({ color = ButtonFirst, size = 30 }) => (
  <FaUserCog size={size} color={color} />
);
export const LogoutIcon = ({ color= ButtonCancel, size = 30 }) => (
  <CiLogout size={size} color={color} />
);

export const UserAccountIcon = ({ color = "#FFC107", size = 30 }) => (
  <FaUserCircle size={size} color={color} />
);

export const UserListIcon = ({ color = ButtonFirst, size = 30 }) => (
  <PiUserList size={size} color={color} />
);

export const VipUserIcon = ({ color = "#FFC107", size = 30 }) => (
  <RiUserStarLine size={size} color={color} />
);

export const StandardUserIcon = ({ color = "#404040", size = 30 }) => (
  <RiUser6Line size={size} color={color} />
);

export const UserOnlineIcon = ({ color = ButtonFirst, size = 30 }) => (
  <RiUserLocationLine size={size} color={color} />
);

export const UserOfflineIcon = ({ color = "#808080", size = 30 }) => (
  <RiSignalWifiOffLine size={size} color={color} />
);

export const MicrosoftIcon = ({ color = "#0693E3", size = 30 }) => (
  <BiLogoMicrosoftTeams size={size} color={color} />
);

export const PasswordIcon = ({ color = "#404040", size = 30 }) => (
  <RiLockPasswordFill size={size} color={color} />
);

export const UserNameIcon = ({ color = "#404040", size = 30 }) => (
  <BiSolidUserDetail size={size} color={color} />
);


export const LanguageIcon = ({ color='#FFFFFF', size = 30 }) => (
  <FaLanguage size={size} color={color} style={{ stroke: "black", strokeWidth: ".2" }} />
);

export const GeneratorIcon = ({ color="#404040", size = 30 }) => (
  <VscServerProcess size={size} color={color} />
);

export const FileIcon = ({ color="#404040", size = 30 }) => (
  <FaRegFileCode size={size} color={color} />
);

export const DetailIcon = ({ color="#404040", size = 30 }) => (
  <CgDetailsMore size={size} color={color} />
);

export const DeleteIcon = ({ color={ButtonCancel}, size = 30 }) => (
  <MdDelete size={size} color={color} />
);

export const RoleChangeIcon = ({ color="#FFC107", size = 30 }) => (
  <TbStatusChange size={size} color={color} />
);

export const VipIcon = ({ color="#FFC107", size = 30 }) => (
  <RiVipFill size={size} color={color} />
);

export const IconSendIcon = ({ color = ButtonFirst, size = 30 }) => (
  <GrSend size={size} color={color} />
);
