import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { crawlReviewData } from "@/api/crawlReview";
import { useSokuriStore } from "@/store/useSokuriStore";

export default function Home() {
  const [url, setUrl] = useState("");
  const setBag = useSokuriStore((s) => s.setBag);
  const setShouldAddBagToWebView = useSokuriStore(
    (s) => s.setShouldAddBagToWebView,
  );
  const setCurrentScreen = useSokuriStore((s) => s.setCurrentScreen);
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = [
    {
      title: "가방 사이즈입력",
      eng: "가방 사이즈를 입력해보세요",
      onPress: () => setCurrentScreen("sizeSummary"),
    },
    {
      title: "시뮬레이션",
      eng: "쉽게 물건을 넣어보세요",
      onPress: () => setCurrentScreen("simulation"),
    },
    {
      title: "소쿠리 가이드",
      eng: "사용방법을 익혀보세요",
      isRecommend: true,
    },
  ];

  const handleSubmit = async () => {
    if (!url.trim()) return;

    Toast.show({
      type: "info",
      text1: "⌛ 크롤링 중...",
      text2: "잠시만 기다려 주세요...",
    });

    try {
      const res = await crawlReviewData(url);

      if (!res || !res.bag) {
        Toast.show({
          type: "error",
          text1: "크롤링 실패",
          text2: "상품 정보를 불러올 수 없습니다.",
        });
        return;
      }

      const [w, h, d] = [res.bag.width, res.bag.height, res.bag.depth];

      setBag({ width: w, height: h, depth: d });
      setShouldAddBagToWebView(true);

      Toast.show({
        type: "success",
        text1: "🖼️ 후기 이미지 분석 완료",
        text2: "가방사이즈를 확인해주세요",
      });
      setCurrentScreen("sizeSummary");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "크롤링 실패",
        text2: err?.response?.data?.detail || "상품 정보를 불러올 수 없습니다.",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TextInput
          style={styles.searchBar}
          placeholder="확인하고 싶은 상품의 URL을 입력하세요"
          value={url}
          onChangeText={setUrl}
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>측정하기</Text>
        </TouchableOpacity>
        <FlatList
          data={cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={192}
          snapToAlignment="start"
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / 192);
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              eng={item.eng}
              isRecommend={item.isRecommend}
              handlePage={item.onPress}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
        <View style={styles.indicatorContainer}>
          {[0, 1, 2].map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicatorDot,
                activeIndex === idx && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>등록된 아이템 목록</Text>
          </View>
          <PracticeItem title="책" />
          <PracticeItem title="노트북" />
          <PracticeItem title="텀블러" />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function Card({ title, eng, isRecommend, handlePage }) {
  return (
    <TouchableOpacity onPress={handlePage}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          {isRecommend && <Text style={styles.newBadge}>추천</Text>}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDuration}>{eng}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PracticeItem({ title, subTitle }) {
  return (
    <View style={styles.practiceItem}>
      <View>
        <Text style={styles.practiceTitle}>{title}</Text>
        <Text style={styles.practiceInfo}>{subTitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  searchBar: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    fontSize: 16,
  },
  cardScroll: {
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  newBadge: {
    backgroundColor: "#e57373",
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardDuration: {
    color: "#555",
  },
  cardPlay: {
    fontSize: 18,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#777",
  },
  practiceItem: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  practiceTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  practiceInfo: {
    color: "#666",
    marginTop: 4,
  },
  practicePlay: {
    fontSize: 18,
    alignSelf: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    backgroundColor: "#ffcd4a",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    backgroundColor: "#555",
  },
});
