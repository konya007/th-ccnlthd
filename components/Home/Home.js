import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Chip, List, ActivityIndicator, Searchbar } from 'react-native-paper';
import { homeStyle } from './style';
import { useEffect, useState } from 'react';
import { myAPI } from '../../utils/apis';
import { endpoint } from '../../configs/config';
import { FlatList, Image, View } from 'react-native';

export default function Home() {
    const [categories, setCategories] = useState([])
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState("")

    const getCategories = async () => {
        try {
            const response = await myAPI.get(endpoint.categories);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    const getCourses = async () => {
        setIsLoading(true);
        try {
            const response = await myAPI.get(endpoint.courses, {
                params: {
                    page: page,
                    query: query
                }
            });
            
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }

    const loadMore = async () => {
        const data = await getCourses();
        if (!data.next) {
            setPage(0);
            return;
        }      
        setCourses([...courses, ...data.results]);
        setPage(page + 1);
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCourses();

            if (!data.next) {
                setPage(0);
            return;
        }      
        }
        
        fetchData();
    }, [query, page])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCategories();
            setCategories(data);
        }
        fetchData();
    }, [])

    return (
        <SafeAreaView style={homeStyle.container}>
            <Text style={homeStyle.h1}>Danh sách khóa học</Text>
            <View>
                {categories.map((item, index) => (
                    <Chip key={index} style={{ margin: 5 }} mode='outlined' icon="book-open-page-variant">
                        {item.name}
                    </Chip>
                ))}
            </View>

            <Text style={homeStyle.h1}>Khóa học nổi bật</Text>  

            <Searchbar
                placeholder="Tìm kiếm khóa học"
                value={setQuery}
                onChangeText={setQuery}
            />

            <FlatList
                style={{ marginTop: 10 }}
                data={courses}
                
                renderItem={
                    ({item}) => 
                    <List.Item
                        key={item.id}
                        style={{ margin: 5, borderRadius: 5 }}
                        title={item.subject}
                        description={item.description}
                        left={props => <Image
                            source={{ uri: item.image }}
                            style={{ width: 50, height: 50, borderRadius: 5 }}
                        />}
                    />
                }
                ListFooterComponent={
                    () => {
                        isLoading && <ActivityIndicator animating={true} color={"#000"} />
                    } 
                }
                onEndReached={() => {
                    if (!isLoading && page > 0) {
                        loadMore()
                    }
                }}
            />

        </SafeAreaView>
    )
}