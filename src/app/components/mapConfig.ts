/**
 * 分层地图配置示例
 * 
 * 这个文件演示如何将 mapHierarchy 数据提取到单独的配置文件中
 * 便于管理和扩展
 */

export const mapConfig = {
  city: {
    id: "city",
    label: "城市",
    imagePath: "/picture/1.png",
    breadcrumb: ["资源地图", "城市"],
    points: [
      {
        id: "point-hefei-university",
        x: 28,
        y: 35,
        label: "合肥工业大学翡翠湖校区",
        targetMapId: "university",
        description: "校园位置",
        icon: "building",
      },
      {
        id: "point-feiyu-lake",
        x: 52,
        y: 22,
        label: "翡翠湖风景区",
        targetMapId: "lake",
        description: "风景区位置",
        icon: "location",
      },
      {
        id: "point-hotel",
        x: 70,
        y: 58,
        label: "格林豪泰酒店",
        targetMapId: "hotel",
        description: "酒店位置",
        icon: "poi",
      },
      {
        id: "point-pharmacy",
        x: 40,
        y: 70,
        label: "肥西县悦为康大药房",
        targetMapId: "pharmacy",
        description: "药房位置",
        icon: "poi",
      },
    ],
  },

  university: {
    id: "university",
    label: "合肥工业大学翡翠湖校区",
    imagePath: "/picture/2.png",
    breadcrumb: ["资源地图", "城市", "合肥工业大学翡翠湖校区"],
    parentId: "city",
    points: [
      {
        id: "point-library",
        x: 35,
        y: 40,
        label: "图书馆",
        description: "校园图书馆",
        icon: "building",
      },
      {
        id: "point-cafeteria",
        x: 65,
        y: 45,
        label: "食堂",
        description: "学生食堂",
        icon: "building",
      },
      {
        id: "point-gymnasium",
        x: 50,
        y: 70,
        label: "体育馆",
        description: "校园体育馆",
        icon: "building",
      },
      {
        id: "point-dormitory",
        x: 25,
        y: 65,
        label: "学生宿舍",
        description: "宿舍区",
        icon: "building",
      },
    ],
  },

  lake: {
    id: "lake",
    label: "翡翠湖风景区",
    imagePath: "/picture/3.png",
    breadcrumb: ["资源地图", "城市", "翡翠湖风景区"],
    parentId: "city",
    points: [
      {
        id: "point-lake-main",
        x: 45,
        y: 50,
        label: "翡翠湖主湖区",
        description: "湖泊主体",
        icon: "location",
      },
      {
        id: "point-lake-viewing",
        x: 30,
        y: 35,
        label: "观景台",
        description: "观景点",
        icon: "location",
      },
      {
        id: "point-lake-park",
        x: 70,
        y: 60,
        label: "湿地公园",
        description: "生态公园",
        icon: "location",
      },
      {
        id: "point-lake-entrance",
        x: 50,
        y: 75,
        label: "景区入口",
        description: "主入口",
        icon: "location",
      },
    ],
  },

  hotel: {
    id: "hotel",
    label: "格林豪泰酒店",
    imagePath: "/picture/4.png",
    breadcrumb: ["资源地图", "城市", "格林豪泰酒店"],
    parentId: "city",
    points: [
      {
        id: "point-hotel-lobby",
        x: 50,
        y: 35,
        label: "大堂",
        description: "酒店大堂",
        icon: "poi",
      },
      {
        id: "point-hotel-restaurant",
        x: 35,
        y: 55,
        label: "餐厅",
        description: "餐饮区",
        icon: "poi",
      },
      {
        id: "point-hotel-rooms",
        x: 65,
        y: 50,
        label: "客房区",
        description: "住宿区",
        icon: "poi",
      },
      {
        id: "point-hotel-parking",
        x: 45,
        y: 70,
        label: "停车场",
        description: "停车区",
        icon: "poi",
      },
    ],
  },

  pharmacy: {
    id: "pharmacy",
    label: "肥西县悦为康大药房",
    imagePath: "/picture/5.png",
    breadcrumb: ["资源地图", "城市", "肥西县悦为康大药房"],
    parentId: "city",
    points: [
      {
        id: "point-pharmacy-counter",
        x: 50,
        y: 40,
        label: "药品柜台",
        description: "药品销售区",
        icon: "poi",
      },
      {
        id: "point-pharmacy-consultation",
        x: 35,
        y: 55,
        label: "咨询台",
        description: "专业咨询",
        icon: "poi",
      },
      {
        id: "point-pharmacy-payment",
        x: 70,
        y: 50,
        label: "收银区",
        description: "结算区",
        icon: "poi",
      },
      {
        id: "point-pharmacy-storage",
        x: 50,
        y: 70,
        label: "仓储区",
        description: "药品储存",
        icon: "poi",
      },
    ],
  },
};

/**
 * 如何使用这个配置文件：
 * 
 * 1. 在 HierarchicalMap.tsx 中替换 mapHierarchy
 * 
 *    // 旧的方式（直接定义）
 *    const mapHierarchy: Record<string, MapLocation> = { ... }
 *    
 *    // 新的方式（导入配置）
 *    import { mapConfig } from './mapConfig';
 *    const mapHierarchy: Record<string, MapLocation> = mapConfig;
 * 
 * 2. 从文件中添加新的地图
 *    
 *    export const mapConfig = {
 *      ...mapConfig,
 *      myNewLocation: {
 *        id: "myNewLocation",
 *        // ... 其他配置
 *      }
 *    }
 * 
 * 3. 动态加载配置
 * 
 *    // 如果想从API加载
 *    const [mapData, setMapData] = useState(mapConfig);
 *    
 *    useEffect(() => {
 *      fetch('/api/maps')
 *        .then(res => res.json())
 *        .then(data => setMapData(data));
 *    }, []);
 */
