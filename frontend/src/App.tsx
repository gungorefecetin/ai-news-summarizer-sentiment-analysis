import { useState, useEffect } from 'react';
import { MantineProvider, Container, Title, Select, TextInput, Button, Card, Text, Group, Badge } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';

interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  published_at: string;
}

interface ArticleResponse {
  article: Article;
  summary: string;
  sentiment: string;
}

function App() {
  const [category, setCategory] = useState('general');
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
    // Initial news fetch
    fetchNews();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/news?category=${category}&query=${query}`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchNews();
  };

  return (
    <MantineProvider>
      <Container size="lg" py="xl">
        <Title order={1} ta="center" mb="xl">
          News Summarizer & Sentiment Analysis
        </Title>

        <Group gap="md" mb="xl">
          <Select
            style={{ flex: 1 }}
            value={category}
            onChange={(value) => setCategory(value || 'general')}
            data={categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))}
            placeholder="Select category"
            label="Category"
          />
          <TextInput
            style={{ flex: 2 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            label="Search Query"
          />
          <Button
            onClick={handleSearch}
            leftSection={<IconSearch size={16} />}
            mt={24}
            loading={loading}
          >
            Search
          </Button>
        </Group>

        {articles.map((article, index) => (
          <Card key={index} shadow="sm" padding="lg" mb="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{article.article.title}</Text>
              <Badge color={article.sentiment === 'positive' ? 'green' : 'red'}>
                {article.sentiment}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Source: {article.article.source} | Published: {new Date(article.article.published_at).toLocaleDateString()}
            </Text>

            <Text size="sm" mb="md">
              <strong>Summary:</strong> {article.summary}
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              component="a"
              href={article.article.url}
              target="_blank"
            >
              Read Full Article
            </Button>
          </Card>
        ))}
      </Container>
    </MantineProvider>
  );
}

export default App;
