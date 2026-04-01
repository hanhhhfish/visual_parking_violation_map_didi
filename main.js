const { createApp, ref, onMounted, computed } = Vue;

// Mock数据 - 模拟正式API返回格式
const mockTickets = [
  {
    id: 1,
    time: '2025-03-15 08:30:00',
    location: '北京市朝阳区建国路88号',
    longitude: 116.4668,
    latitude: 39.9183,
    poi: '国贸中心',
    road: '建国路',
    type: '违停',
    amount: 200
  },
  {
    id: 2,
    time: '2025-03-15 09:15:00',
    location: '北京市海淀区中关村大街1号',
    longitude: 116.3053,
    latitude: 39.9847,
    poi: '中关村广场',
    road: '中关村大街',
    type: '违停',
    amount: 200
  },
  {
    id: 3,
    time: '2025-03-15 10:20:00',
    location: '北京市西城区西单北大街120号',
    longitude: 116.3661,
    latitude: 39.9123,
    poi: '西单商场',
    road: '西单北大街',
    type: '违停',
    amount: 200
  },
  {
    id: 4,
    time: '2025-03-15 11:05:00',
    location: '北京市东城区王府井大街99号',
    longitude: 116.4107,
    latitude: 39.9147,
    poi: '王府井步行街',
    road: '王府井大街',
    type: '违停',
    amount: 200
  },
  {
    id: 5,
    time: '2025-03-15 14:30:00',
    location: '北京市丰台区丰台路18号',
    longitude: 116.2889,
    latitude: 39.8584,
    poi: '丰台体育中心',
    road: '丰台路',
    type: '违停',
    amount: 200
  },
  {
    id: 6,
    time: '2025-03-16 08:45:00',
    location: '北京市朝阳区朝阳公园路1号',
    longitude: 116.4696,
    latitude: 39.9388,
    poi: '朝阳公园',
    road: '朝阳公园路',
    type: '违停',
    amount: 200
  },
  {
    id: 7,
    time: '2025-03-16 10:00:00',
    location: '北京市海淀区颐和园路19号',
    longitude: 116.2755,
    latitude: 39.9988,
    poi: '颐和园',
    road: '颐和园路',
    type: '违停',
    amount: 200
  },
  {
    id: 8,
    time: '2025-03-16 14:00:00',
    location: '北京市东城区景山前街4号',
    longitude: 116.3972,
    latitude: 39.9163,
    poi: '故宫',
    road: '景山前街',
    type: '违停',
    amount: 200
  },
  {
    id: 9,
    time: '2025-03-17 09:30:00',
    location: '北京市西城区前门大街1号',
    longitude: 116.3974,
    latitude: 39.8997,
    poi: '前门大街',
    road: '前门大街',
    type: '违停',
    amount: 200
  },
  {
    id: 10,
    time: '2025-03-17 15:20:00',
    location: '北京市朝阳区三里屯路19号',
    longitude: 116.4535,
    latitude: 39.9390,
    poi: '三里屯太古里',
    road: '三里屯路',
    type: '违停',
    amount: 200
  },
  {
    id: 11,
    time: '2025-03-18 08:00:00',
    location: '北京市海淀区清华大学西门',
    longitude: 116.3279,
    latitude: 40.0031,
    poi: '清华大学',
    road: '清华园路',
    type: '违停',
    amount: 200
  },
  {
    id: 12,
    time: '2025-03-18 11:30:00',
    location: '北京市海淀区北京大学东门',
    longitude: 116.3055,
    latitude: 39.9920,
    poi: '北京大学',
    road: '中关村北大街',
    type: '违停',
    amount: 200
  },
  {
    id: 13,
    time: '2025-03-19 10:15:00',
    location: '北京市朝阳区国家体育场北路1号',
    longitude: 116.3974,
    latitude: 39.9992,
    poi: '鸟巢',
    road: '国家体育场北路',
    type: '违停',
    amount: 200
  },
  {
    id: 14,
    time: '2025-03-19 16:00:00',
    location: '北京市朝阳区国家游泳中心',
    longitude: 116.3926,
    latitude: 39.9967,
    poi: '水立方',
    road: '天辰东路',
    type: '违停',
    amount: 200
  },
  {
    id: 15,
    time: '2025-03-20 09:00:00',
    location: '北京市西城区西长安街2号',
    longitude: 116.3971,
    latitude: 39.9075,
    poi: '国家大剧院',
    road: '西长安街',
    type: '违停',
    amount: 200
  }
];

createApp({
  setup() {
    // 响应式数据
    const map = ref(null);
    const markers = ref([]);
    const heatmapLayer = ref(null);
    const tickets = ref(mockTickets);
    const filteredTickets = ref(mockTickets);
    const loading = ref(false);
    const error = ref('');
    const activeTab = ref('heatmap');
    
    // 热力图配置
    const heatmapConfig = ref({
      radius: 40, // 半径
      blur: 30,   // 模糊度
      max: 10     // 热力值最大值
    });
    
    // 城市数据（完整国内地级市列表）
    const cities = ref([
      // 直辖市
      { label: '北京', value: '北京' },
      { label: '上海', value: '上海' },
      { label: '天津', value: '天津' },
      { label: '重庆', value: '重庆' },
      
      // 河北省
      { label: '石家庄', value: '石家庄' },
      { label: '唐山', value: '唐山' },
      { label: '秦皇岛', value: '秦皇岛' },
      { label: '邯郸', value: '邯郸' },
      { label: '邢台', value: '邢台' },
      { label: '保定', value: '保定' },
      { label: '张家口', value: '张家口' },
      { label: '承德', value: '承德' },
      { label: '沧州', value: '沧州' },
      { label: '廊坊', value: '廊坊' },
      { label: '衡水', value: '衡水' },
      
      // 山西省
      { label: '太原', value: '太原' },
      { label: '大同', value: '大同' },
      { label: '阳泉', value: '阳泉' },
      { label: '长治', value: '长治' },
      { label: '晋城', value: '晋城' },
      { label: '朔州', value: '朔州' },
      { label: '晋中', value: '晋中' },
      { label: '运城', value: '运城' },
      { label: '忻州', value: '忻州' },
      { label: '临汾', value: '临汾' },
      { label: '吕梁', value: '吕梁' },
      
      // 内蒙古
      { label: '呼和浩特', value: '呼和浩特' },
      { label: '包头', value: '包头' },
      { label: '乌海', value: '乌海' },
      { label: '赤峰', value: '赤峰' },
      { label: '通辽', value: '通辽' },
      { label: '鄂尔多斯', value: '鄂尔多斯' },
      { label: '呼伦贝尔', value: '呼伦贝尔' },
      { label: '巴彦淖尔', value: '巴彦淖尔' },
      { label: '乌兰察布', value: '乌兰察布' },
      { label: '兴安盟', value: '兴安盟' },
      { label: '锡林郭勒盟', value: '锡林郭勒盟' },
      { label: '阿拉善盟', value: '阿拉善盟' },
      
      // 辽宁省
      { label: '沈阳', value: '沈阳' },
      { label: '大连', value: '大连' },
      { label: '鞍山', value: '鞍山' },
      { label: '抚顺', value: '抚顺' },
      { label: '本溪', value: '本溪' },
      { label: '丹东', value: '丹东' },
      { label: '锦州', value: '锦州' },
      { label: '营口', value: '营口' },
      { label: '阜新', value: '阜新' },
      { label: '辽阳', value: '辽阳' },
      { label: '盘锦', value: '盘锦' },
      { label: '铁岭', value: '铁岭' },
      { label: '朝阳', value: '朝阳' },
      { label: '葫芦岛', value: '葫芦岛' },
      
      // 吉林省
      { label: '长春', value: '长春' },
      { label: '吉林', value: '吉林' },
      { label: '四平', value: '四平' },
      { label: '辽源', value: '辽源' },
      { label: '通化', value: '通化' },
      { label: '白山', value: '白山' },
      { label: '松原', value: '松原' },
      { label: '白城', value: '白城' },
      { label: '延边朝鲜族自治州', value: '延边' },
      
      // 黑龙江省
      { label: '哈尔滨', value: '哈尔滨' },
      { label: '齐齐哈尔', value: '齐齐哈尔' },
      { label: '鸡西', value: '鸡西' },
      { label: '鹤岗', value: '鹤岗' },
      { label: '双鸭山', value: '双鸭山' },
      { label: '大庆', value: '大庆' },
      { label: '伊春', value: '伊春' },
      { label: '佳木斯', value: '佳木斯' },
      { label: '七台河', value: '七台河' },
      { label: '牡丹江', value: '牡丹江' },
      { label: '黑河', value: '黑河' },
      { label: '绥化', value: '绥化' },
      { label: '大兴安岭地区', value: '大兴安岭' },
      
      // 江苏省
      { label: '南京', value: '南京' },
      { label: '无锡', value: '无锡' },
      { label: '徐州', value: '徐州' },
      { label: '常州', value: '常州' },
      { label: '苏州', value: '苏州' },
      { label: '南通', value: '南通' },
      { label: '连云港', value: '连云港' },
      { label: '淮安', value: '淮安' },
      { label: '盐城', value: '盐城' },
      { label: '扬州', value: '扬州' },
      { label: '镇江', value: '镇江' },
      { label: '泰州', value: '泰州' },
      { label: '宿迁', value: '宿迁' },
      
      // 浙江省
      { label: '杭州', value: '杭州' },
      { label: '宁波', value: '宁波' },
      { label: '温州', value: '温州' },
      { label: '嘉兴', value: '嘉兴' },
      { label: '湖州', value: '湖州' },
      { label: '绍兴', value: '绍兴' },
      { label: '金华', value: '金华' },
      { label: '衢州', value: '衢州' },
      { label: '舟山', value: '舟山' },
      { label: '台州', value: '台州' },
      { label: '丽水', value: '丽水' },
      
      // 安徽省
      { label: '合肥', value: '合肥' },
      { label: '芜湖', value: '芜湖' },
      { label: '蚌埠', value: '蚌埠' },
      { label: '淮南', value: '淮南' },
      { label: '马鞍山', value: '马鞍山' },
      { label: '淮北', value: '淮北' },
      { label: '铜陵', value: '铜陵' },
      { label: '安庆', value: '安庆' },
      { label: '黄山', value: '黄山' },
      { label: '滁州', value: '滁州' },
      { label: '阜阳', value: '阜阳' },
      { label: '宿州', value: '宿州' },
      { label: '六安', value: '六安' },
      { label: '亳州', value: '亳州' },
      { label: '池州', value: '池州' },
      { label: '宣城', value: '宣城' },
      
      // 福建省
      { label: '福州', value: '福州' },
      { label: '厦门', value: '厦门' },
      { label: '莆田', value: '莆田' },
      { label: '三明', value: '三明' },
      { label: '泉州', value: '泉州' },
      { label: '漳州', value: '漳州' },
      { label: '南平', value: '南平' },
      { label: '龙岩', value: '龙岩' },
      { label: '宁德', value: '宁德' },
      
      // 江西省
      { label: '南昌', value: '南昌' },
      { label: '景德镇', value: '景德镇' },
      { label: '萍乡', value: '萍乡' },
      { label: '九江', value: '九江' },
      { label: '新余', value: '新余' },
      { label: '鹰潭', value: '鹰潭' },
      { label: '赣州', value: '赣州' },
      { label: '吉安', value: '吉安' },
      { label: '宜春', value: '宜春' },
      { label: '抚州', value: '抚州' },
      { label: '上饶', value: '上饶' },
      
      // 山东省
      { label: '济南', value: '济南' },
      { label: '青岛', value: '青岛' },
      { label: '淄博', value: '淄博' },
      { label: '枣庄', value: '枣庄' },
      { label: '东营', value: '东营' },
      { label: '烟台', value: '烟台' },
      { label: '潍坊', value: '潍坊' },
      { label: '济宁', value: '济宁' },
      { label: '泰安', value: '泰安' },
      { label: '威海', value: '威海' },
      { label: '日照', value: '日照' },
      { label: '临沂', value: '临沂' },
      { label: '德州', value: '德州' },
      { label: '聊城', value: '聊城' },
      { label: '滨州', value: '滨州' },
      { label: '菏泽', value: '菏泽' },
      
      // 河南省
      { label: '郑州', value: '郑州' },
      { label: '开封', value: '开封' },
      { label: '洛阳', value: '洛阳' },
      { label: '平顶山', value: '平顶山' },
      { label: '安阳', value: '安阳' },
      { label: '鹤壁', value: '鹤壁' },
      { label: '新乡', value: '新乡' },
      { label: '焦作', value: '焦作' },
      { label: '濮阳', value: '濮阳' },
      { label: '许昌', value: '许昌' },
      { label: '漯河', value: '漯河' },
      { label: '三门峡', value: '三门峡' },
      { label: '南阳', value: '南阳' },
      { label: '商丘', value: '商丘' },
      { label: '信阳', value: '信阳' },
      { label: '周口', value: '周口' },
      { label: '驻马店', value: '驻马店' },
      
      // 湖北省
      { label: '武汉', value: '武汉' },
      { label: '黄石', value: '黄石' },
      { label: '十堰', value: '十堰' },
      { label: '宜昌', value: '宜昌' },
      { label: '襄阳', value: '襄阳' },
      { label: '鄂州', value: '鄂州' },
      { label: '荆门', value: '荆门' },
      { label: '孝感', value: '孝感' },
      { label: '荆州', value: '荆州' },
      { label: '黄冈', value: '黄冈' },
      { label: '咸宁', value: '咸宁' },
      { label: '随州', value: '随州' },
      { label: '恩施土家族苗族自治州', value: '恩施' },
      
      // 湖南省
      { label: '长沙', value: '长沙' },
      { label: '株洲', value: '株洲' },
      { label: '湘潭', value: '湘潭' },
      { label: '衡阳', value: '衡阳' },
      { label: '邵阳', value: '邵阳' },
      { label: '岳阳', value: '岳阳' },
      { label: '常德', value: '常德' },
      { label: '张家界', value: '张家界' },
      { label: '益阳', value: '益阳' },
      { label: '郴州', value: '郴州' },
      { label: '永州', value: '永州' },
      { label: '怀化', value: '怀化' },
      { label: '娄底', value: '娄底' },
      { label: '湘西土家族苗族自治州', value: '湘西' },
      
      // 广东省
      { label: '广州', value: '广州' },
      { label: '深圳', value: '深圳' },
      { label: '珠海', value: '珠海' },
      { label: '汕头', value: '汕头' },
      { label: '佛山', value: '佛山' },
      { label: '韶关', value: '韶关' },
      { label: '湛江', value: '湛江' },
      { label: '肇庆', value: '肇庆' },
      { label: '江门', value: '江门' },
      { label: '茂名', value: '茂名' },
      { label: '惠州', value: '惠州' },
      { label: '梅州', value: '梅州' },
      { label: '汕尾', value: '汕尾' },
      { label: '河源', value: '河源' },
      { label: '阳江', value: '阳江' },
      { label: '清远', value: '清远' },
      { label: '东莞', value: '东莞' },
      { label: '中山', value: '中山' },
      { label: '潮州', value: '潮州' },
      { label: '揭阳', value: '揭阳' },
      { label: '云浮', value: '云浮' },
      
      // 广西
      { label: '南宁', value: '南宁' },
      { label: '柳州', value: '柳州' },
      { label: '桂林', value: '桂林' },
      { label: '梧州', value: '梧州' },
      { label: '北海', value: '北海' },
      { label: '防城港', value: '防城港' },
      { label: '钦州', value: '钦州' },
      { label: '贵港', value: '贵港' },
      { label: '玉林', value: '玉林' },
      { label: '百色', value: '百色' },
      { label: '贺州', value: '贺州' },
      { label: '河池', value: '河池' },
      { label: '来宾', value: '来宾' },
      { label: '崇左', value: '崇左' },
      
      // 海南省
      { label: '海口', value: '海口' },
      { label: '三亚', value: '三亚' },
      { label: '三沙', value: '三沙' },
      { label: '儋州', value: '儋州' },
      
      // 四川省
      { label: '成都', value: '成都' },
      { label: '自贡', value: '自贡' },
      { label: '攀枝花', value: '攀枝花' },
      { label: '泸州', value: '泸州' },
      { label: '德阳', value: '德阳' },
      { label: '绵阳', value: '绵阳' },
      { label: '广元', value: '广元' },
      { label: '遂宁', value: '遂宁' },
      { label: '内江', value: '内江' },
      { label: '乐山', value: '乐山' },
      { label: '南充', value: '南充' },
      { label: '眉山', value: '眉山' },
      { label: '宜宾', value: '宜宾' },
      { label: '广安', value: '广安' },
      { label: '达州', value: '达州' },
      { label: '雅安', value: '雅安' },
      { label: '巴中', value: '巴中' },
      { label: '资阳', value: '资阳' },
      { label: '阿坝藏族羌族自治州', value: '阿坝' },
      { label: '甘孜藏族自治州', value: '甘孜' },
      { label: '凉山彝族自治州', value: '凉山' },
      
      // 贵州省
      { label: '贵阳', value: '贵阳' },
      { label: '六盘水', value: '六盘水' },
      { label: '遵义', value: '遵义' },
      { label: '安顺', value: '安顺' },
      { label: '毕节', value: '毕节' },
      { label: '铜仁', value: '铜仁' },
      { label: '黔西南布依族苗族自治州', value: '黔西南' },
      { label: '黔东南苗族侗族自治州', value: '黔东南' },
      { label: '黔南布依族苗族自治州', value: '黔南' },
      
      // 云南省
      { label: '昆明', value: '昆明' },
      { label: '曲靖', value: '曲靖' },
      { label: '玉溪', value: '玉溪' },
      { label: '保山', value: '保山' },
      { label: '昭通', value: '昭通' },
      { label: '丽江', value: '丽江' },
      { label: '普洱', value: '普洱' },
      { label: '临沧', value: '临沧' },
      { label: '楚雄彝族自治州', value: '楚雄' },
      { label: '红河哈尼族彝族自治州', value: '红河' },
      { label: '文山壮族苗族自治州', value: '文山' },
      { label: '西双版纳傣族自治州', value: '西双版纳' },
      { label: '大理白族自治州', value: '大理' },
      { label: '德宏傣族景颇族自治州', value: '德宏' },
      { label: '怒江傈僳族自治州', value: '怒江' },
      { label: '迪庆藏族自治州', value: '迪庆' },
      
      // 西藏
      { label: '拉萨', value: '拉萨' },
      { label: '日喀则', value: '日喀则' },
      { label: '昌都', value: '昌都' },
      { label: '林芝', value: '林芝' },
      { label: '山南', value: '山南' },
      { label: '那曲', value: '那曲' },
      { label: '阿里地区', value: '阿里' },
      
      // 陕西省
      { label: '西安', value: '西安' },
      { label: '铜川', value: '铜川' },
      { label: '宝鸡', value: '宝鸡' },
      { label: '咸阳', value: '咸阳' },
      { label: '渭南', value: '渭南' },
      { label: '延安', value: '延安' },
      { label: '汉中', value: '汉中' },
      { label: '榆林', value: '榆林' },
      { label: '安康', value: '安康' },
      { label: '商洛', value: '商洛' },
      
      // 甘肃省
      { label: '兰州', value: '兰州' },
      { label: '嘉峪关', value: '嘉峪关' },
      { label: '金昌', value: '金昌' },
      { label: '白银', value: '白银' },
      { label: '天水', value: '天水' },
      { label: '武威', value: '武威' },
      { label: '张掖', value: '张掖' },
      { label: '平凉', value: '平凉' },
      { label: '酒泉', value: '酒泉' },
      { label: '庆阳', value: '庆阳' },
      { label: '定西', value: '定西' },
      { label: '陇南', value: '陇南' },
      { label: '临夏回族自治州', value: '临夏' },
      { label: '甘南藏族自治州', value: '甘南' },
      
      // 青海省
      { label: '西宁', value: '西宁' },
      { label: '海东', value: '海东' },
      { label: '海北藏族自治州', value: '海北' },
      { label: '黄南藏族自治州', value: '黄南' },
      { label: '海南藏族自治州', value: '海南' },
      { label: '果洛藏族自治州', value: '果洛' },
      { label: '玉树藏族自治州', value: '玉树' },
      { label: '海西蒙古族藏族自治州', value: '海西' },
      
      // 宁夏
      { label: '银川', value: '银川' },
      { label: '石嘴山', value: '石嘴山' },
      { label: '吴忠', value: '吴忠' },
      { label: '固原', value: '固原' },
      { label: '中卫', value: '中卫' },
      
      // 新疆
      { label: '乌鲁木齐', value: '乌鲁木齐' },
      { label: '克拉玛依', value: '克拉玛依' },
      { label: '吐鲁番', value: '吐鲁番' },
      { label: '哈密', value: '哈密' },
      { label: '昌吉回族自治州', value: '昌吉' },
      { label: '博尔塔拉蒙古自治州', value: '博尔塔拉' },
      { label: '巴音郭楞蒙古自治州', value: '巴音郭楞' },
      { label: '阿克苏地区', value: '阿克苏' },
      { label: '克孜勒苏柯尔克孜自治州', value: '克孜勒苏' },
      { label: '喀什地区', value: '喀什' },
      { label: '和田地区', value: '和田' },
      { label: '伊犁哈萨克自治州', value: '伊犁' },
      { label: '塔城地区', value: '塔城' },
      { label: '阿勒泰地区', value: '阿勒泰' },
      { label: '石河子', value: '石河子' },
      { label: '阿拉尔', value: '阿拉尔' },
      { label: '图木舒克', value: '图木舒克' },
      { label: '五家渠', value: '五家渠' },
      { label: '北屯', value: '北屯' },
      { label: '铁门关', value: '铁门关' },
      { label: '双河', value: '双河' },
      { label: '可克达拉', value: '可克达拉' },
      { label: '昆玉', value: '昆玉' }
    ]);
    
    // 搜索条件
    const searchParams = ref({
      timeRange: [],
      city: '',
      keyword: ''
    });
    
    // 设置默认时间范围为近两年
    const setDefaultTimeRange = () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 2);
      
      searchParams.value.timeRange = [
        startDate.toISOString().slice(0, 19).replace('T', ' '),
        endDate.toISOString().slice(0, 19).replace('T', ' ')
      ];
    };
    
    // 初始化默认值
    setDefaultTimeRange();
    
    // API请求函数
    const fetchTicketsFromAPI = async () => {
      loading.value = true;
      error.value = '';
      try {
        // 构建请求参数
        const params = new URLSearchParams();
        if (searchParams.value.timeRange.length === 2) {
          params.append('startTime', searchParams.value.timeRange[0]);
          params.append('endTime', searchParams.value.timeRange[1]);
        }
        if (searchParams.value.city) {
          params.append('city', searchParams.value.city);
        }
        if (searchParams.value.keyword) {
          params.append('keyword', searchParams.value.keyword);
        }

        // 发送请求（替换为公司实际API地址）
        // 注意：这里使用mock数据作为示例，实际项目中替换为真实API
        // const response = await fetch(`https://your-company-api.com/tickets?${params.toString()}`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // 如果需要认证，添加token
        //     // 'Authorization': `Bearer ${yourToken}`
        //   }
        // });
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 使用mock数据作为示例
        const data = mockTickets;
        
        // 转换数据格式（如果需要）
        const transformedData = transformTicketData(data);
        tickets.value = transformedData;
        filteredTickets.value = transformedData;
        updateMapLayer();
      } catch (err) {
        console.error('获取罚单数据失败:', err);
        error.value = '获取数据失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    // 数据转换函数
    const transformTicketData = (apiData) => {
      return apiData.map(item => ({
        id: item.id || item.ticketId,
        time: item.time || item.createTime,
        location: item.location || item.address,
        longitude: parseFloat(item.longitude || item.lng),
        latitude: parseFloat(item.latitude || item.lat),
        poi: item.poi || item.poiName,
        road: item.road || item.roadName,
        type: item.type || item.ticketType,
        amount: item.amount || item.fineAmount
      }));
    };
    
    // 初始化地图
    onMounted(() => {
      console.log('开始初始化地图');
      // 检查地图容器
      const mapContainer = document.getElementById('map');
      console.log('地图容器:', mapContainer);
      console.log('地图容器尺寸:', mapContainer.clientWidth, 'x', mapContainer.clientHeight);
      
      // 创建地图实例
      map.value = L.map('map').setView([39.9042, 116.4074], 12);
      console.log('地图实例创建成功:', map.value);
      
      // 添加底图（使用高德地图作为替代方案）
      const tileLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德地图'
      });
      
      // 添加错误处理
      tileLayer.on('tileerror', (error) => {
        console.error('瓦片加载错误:', error);
      });
      
      tileLayer.addTo(map.value);
      console.log('底图添加成功');
      
      // 从API获取数据
      fetchTicketsFromAPI();
      console.log('数据获取请求已发送');
    });
    
    // 处理标签切换
    const handleTabClick = (tab) => {
      console.log('切换到标签:', tab.props.name);
      updateMapLayer();
    };
    
    // 切换视图
    const switchView = (view) => {
      console.log('切换视图到:', view);
      activeTab.value = view;
      updateMapLayer();
    };
    
    // 更新地图图层
    const updateMapLayer = () => {
      console.log('更新地图图层，当前视图:', activeTab.value);
      // 清除所有图层
      clearMapLayers();
      
      if (activeTab.value === 'detail') {
        // 显示标记点
        console.log('显示标记点');
        addMarkers();
      } else if (activeTab.value === 'heatmap') {
        // 显示热力图
        console.log('显示热力图');
        addHeatmap();
      }
    };
    
    // 清除地图图层
    const clearMapLayers = () => {
      // 清除标记点
      markers.value.forEach(marker => map.value.removeLayer(marker));
      markers.value = [];
      
      // 清除热力图
      if (heatmapLayer.value) {
        map.value.removeLayer(heatmapLayer.value);
        heatmapLayer.value = null;
      }
    };
    
    // 添加标记点
    const addMarkers = () => {
      // 清除现有标记
      markers.value.forEach(marker => map.value.removeLayer(marker));
      markers.value = [];
      
      // 添加新标记
      filteredTickets.value.forEach(ticket => {
        const marker = L.marker([ticket.latitude, ticket.longitude])
          .addTo(map.value)
          .bindPopup(`
            <div style="padding: 8px;">
              <h4 style="margin-bottom: 8px;">罚单信息</h4>
              <p><strong>时间:</strong> ${ticket.time}</p>
              <p><strong>位置:</strong> ${ticket.location}</p>
              <p><strong>类型:</strong> ${ticket.type}</p>
              <p><strong>金额:</strong> ¥${ticket.amount}</p>
              <p><strong>POI:</strong> ${ticket.poi}</p>
              <p><strong>道路:</strong> ${ticket.road}</p>
            </div>
          `);
        markers.value.push(marker);
      });
    };
    
    // 添加热力图
    const addHeatmap = () => {
      // 计算热力值
      const heatData = filteredTickets.value.map(ticket => [
        ticket.latitude,
        ticket.longitude,
        heatmapConfig.value.max // 使用配置的热力值最大值
      ]);
      
      // 创建热力图图层
      heatmapLayer.value = L.heatLayer(heatData, {
        radius: heatmapConfig.value.radius, // 使用配置的半径
        blur: heatmapConfig.value.blur,     // 使用配置的模糊度
        maxZoom: 17,
        gradient: {
          0.01: '#ffffff', // 最低密度 - 白色
          0.1: '#ffeeee',  // 低密度 - 极浅红色
          0.3: '#ffcccc',  // 低密度 - 浅红色
          0.5: '#ff9999',  // 中密度 - 粉红色
          0.7: '#ff6666',  // 中高密度 - 红色
          0.9: '#ff3333',  // 高密度 - 深红色
          1: '#ff0000'     // 最高密度 - 鲜红色
        }
      }).addTo(map.value);
    };
    
    // 更新热力图
    const updateHeatmap = () => {
      if (activeTab.value === 'heatmap') {
        // 清除现有热力图
        if (heatmapLayer.value) {
          map.value.removeLayer(heatmapLayer.value);
          heatmapLayer.value = null;
        }
        // 重新添加热力图
        addHeatmap();
      }
    };
    
    // 搜索功能
    const searchTickets = () => {
      fetchTicketsFromAPI();
    };
    
    // 重置搜索
    const resetSearch = () => {
      searchParams.value = {
        timeRange: [],
        city: '',
        keyword: ''
      };
      // 重新设置默认时间范围
      setDefaultTimeRange();
      // 重新获取数据
      fetchTicketsFromAPI();
    };
    
    // 点击罚单项，定位到地图
    const locateTicket = (ticket) => {
      map.value.setView([ticket.latitude, ticket.longitude], 15);
      // 触发标记点弹窗
      markers.value.forEach(marker => {
        const latlng = marker.getLatLng();
        if (latlng.lat === ticket.latitude && latlng.lng === ticket.longitude) {
          marker.openPopup();
        }
      });
    };
    
    return {
      searchParams,
      filteredTickets,
      cities,
      loading,
      error,
      activeTab,
      heatmapConfig,
      searchTickets,
      resetSearch,
      locateTicket,
      updateHeatmap,
      switchView
    };
  }
}).use(ElementPlus).mount('#app');