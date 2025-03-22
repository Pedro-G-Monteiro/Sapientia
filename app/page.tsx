'use client';

import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LikeOutlined,
  LockOutlined,
  MessageOutlined,
  PlusOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  List,
  Radio,
  Row,
  Select,
  Skeleton,
  Slider,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
  Typography
} from 'antd';
import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

export default function HomePage() {
  const { mode } = useTheme();
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => {
    setLoading(!loading);
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          Plataforma Educacional
        </Title>
        <ThemeSwitcher />
      </div>

      <div className={styles.content}>
        {/* Card básico de introdução */}
        <Card className={styles.card} style={{ marginBottom: '2rem' }}>
          <Title level={3}>Bem-vindo!</Title>
          <Paragraph>
            Este é um exemplo de página usando o tema verde (#3a9c74) com suporte
            a modos claro e escuro. Abaixo você encontrará exemplos de diferentes tipos de cards
            do Ant Design que você pode utilizar no seu projeto.
          </Paragraph>
          <Paragraph>
            Modo atual: <strong>{mode === 'light' ? 'Claro' : 'Escuro'}</strong>
          </Paragraph>
          <div className={styles.colorPalette}>
            <div className={styles.colorItem}>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--primary-color)' }}></div>
              <span>Primária</span>
            </div>
            <div className={styles.colorItem}>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--primary-color-light)' }}></div>
              <span>Primária (clara)</span>
            </div>
            <div className={styles.colorItem}>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--primary-color-dark)' }}></div>
              <span>Primária (escura)</span>
            </div>
            <div className={styles.colorItem}>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--secondary-color)' }}></div>
              <span>Secundária</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <Button type="primary">Botão Primário</Button>
            <Button>Botão Padrão</Button>
            <Button type="dashed">Botão Tracejado</Button>
            <Button type="text">Botão Texto</Button>
            <Button type="link">Botão Link</Button>
          </div>
        </Card>

        <Divider orientation="left">Exemplos de Cards</Divider>
        
        {/* Seção com diferentes tipos de cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card 
              title="Card Básico" 
              extra={<a href="#">Mais</a>}
              className={styles.demoCard}
            >
              <p>Card com título e link extra</p>
              <p>Útil para mostrar informações simples</p>
              <p>Pode conter texto, tabelas, formulários, etc.</p>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className={styles.demoCard}
              cover={<Image alt="exemplo" src="https://via.placeholder.com/300x200" />}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://via.placeholder.com/40x40" />}
                title="Card com Meta Informações"
                description="Este card inclui uma imagem de capa, avatar, título, descrição e ações no rodapé"
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className={styles.demoCard}>
              <Skeleton loading={loading} avatar active>
                <Meta
                  avatar={<Avatar src="https://via.placeholder.com/40x40" />}
                  title="Card com estado de carregamento"
                  description="Este card demonstra o componente Skeleton para estado de carregamento"
                />
              </Skeleton>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Switch checked={loading} onChange={toggleLoading} />
                <span style={{ marginLeft: 8 }}>Mostrar carregamento</span>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Card com Guias"
              className={styles.demoCard}
            >
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: 'Guia 1',
                    children: 'Conteúdo da guia 1',
                  },
                  {
                    key: '2',
                    label: 'Guia 2',
                    children: 'Conteúdo da guia 2',
                  },
                  {
                    key: '3',
                    label: 'Guia 3',
                    children: 'Conteúdo da guia 3',
                  },
                ]}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card title="Card com Estatísticas" className={styles.demoCard}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Alunos Ativos"
                    value={1128}
                    prefix={<LikeOutlined />}
                    valueStyle={{ color: 'var(--primary-color)' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Crescimento"
                    value={11.28}
                    precision={2}
                    valueStyle={{ color: 'var(--success-color)' }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Badge.Ribbon text="Popular" color="var(--primary-color)">
              <Card
                title="Card com Badge Ribbon"
                className={styles.demoCard}
              >
                <p>Este card utiliza um badge no canto superior</p>
                <p>Útil para destacar cards ou conteúdos especiais</p>
              </Card>
            </Badge.Ribbon>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card
              className={styles.demoCard}
              actions={[
                <div key="like">
                  <HeartOutlined /> 156
                </div>,
                <div key="comment">
                  <MessageOutlined /> 2
                </div>,
                <div key="star">
                  <StarOutlined /> 38
                </div>,
              ]}
            >
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'Matemática Básica',
                    description: 'Curso introdutório de matemática',
                  },
                  {
                    title: 'Programação em Python',
                    description: 'Aprenda a programar do zero',
                  },
                  {
                    title: 'Marketing Digital',
                    description: 'Estratégias para redes sociais',
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src="https://via.placeholder.com/40x40" />}
                      title={<a href="#">{item.title}</a>}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Card com Borda Colorida"
              className={styles.demoCard}
              style={{ borderTop: '2px solid var(--primary-color)' }}
            >
              <p>Este card tem uma borda colorida no topo</p>
              <p>Útil para categorizar visualmente diferentes tipos de conteúdo</p>
              <Tag color="var(--primary-color)">Importante</Tag>
              <Tag color="var(--secondary-color)">Destaque</Tag>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              className={styles.demoCard}
              style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
            >
              <Title level={4} style={{ color: 'white', marginTop: 0 }}>Card com Fundo Colorido</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Este card tem um fundo colorido e sem borda.
                Útil para chamadas de ação ou informações de destaque.
              </Text>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" ghost>Ação Principal</Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left" style={{ margin: '40px 0 24px' }}>Exemplos de Forms</Divider>
        
        <Row gutter={[24, 24]}>
          {/* Formulário básico */}
          <Col xs={24} lg={12}>
            <Card title="Formulário Básico" className={styles.demoCard}>
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
              >
                <Form.Item
                  label="Nome de Usuário"
                  name="username"
                  rules={[{ required: true, message: 'Por favor insira seu nome de usuário!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Senha"
                  name="password"
                  rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                  <Checkbox>Lembrar-me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Enviar
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Formulário em linha */}
          <Col xs={24} lg={12}>
            <Card title="Formulário em Linha" className={styles.demoCard}>
              <Form
                name="inline"
                layout="inline"
                initialValues={{ remember: true }}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Obrigatório!' }]}
                >
                  <Input placeholder="Nome de usuário" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Obrigatório!' }]}
                >
                  <Input.Password placeholder="Senha" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Entrar
                  </Button>
                </Form.Item>
              </Form>
              
              <Divider dashed />
              
              <Paragraph>
                Formulários em linha são úteis para filtros, pesquisas rápidas ou login compacto.
              </Paragraph>
            </Card>
          </Col>

          {/* Formulário de validação */}
          <Col xs={24} lg={12}>
            <Card title="Formulário com Validação Avançada" className={styles.demoCard}>
              <Form
                name="validation"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor insira seu e-mail!' },
                    { type: 'email', message: 'E-mail em formato inválido!' }
                  ]}
                >
                  <Input />
                </Form.Item>
                
                <Form.Item
                  label="Senha"
                  name="password"
                  rules={[
                    { required: true, message: 'Por favor insira sua senha!' },
                    { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                
                <Form.Item
                  label="Confirmação de Senha"
                  name="confirm"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Por favor confirme sua senha!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('As senhas não coincidem!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  wrapperCol={{ offset: 8, span: 16 }}
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('Aceite os termos para continuar')),
                    },
                  ]}
                >
                  <Checkbox>
                    Li e aceito os <a href="#">termos de uso</a>
                  </Checkbox>
                </Form.Item>
                
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Registrar
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Formulário com layout personalizado */}
          <Col xs={24} lg={12}>
            <Card title="Formulário de Pesquisa" className={styles.demoCard}>
              <Form
                name="search"
                layout="vertical"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Nome do Curso"
                      name="courseName"
                    >
                      <Input placeholder="Digite o nome do curso" />
                    </Form.Item>
                  </Col>
                  
                  <Col span={12}>
                    <Form.Item
                      label="Categoria"
                      name="category"
                    >
                      <Select placeholder="Selecione uma categoria">
                        <Select.Option value="programming">Programação</Select.Option>
                        <Select.Option value="design">Design</Select.Option>
                        <Select.Option value="business">Negócios</Select.Option>
                        <Select.Option value="marketing">Marketing</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Nível"
                      name="level"
                    >
                      <Radio.Group>
                        <Radio value="beginner">Iniciante</Radio>
                        <Radio value="intermediate">Intermediário</Radio>
                        <Radio value="advanced">Avançado</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  
                  <Col span={12}>
                    <Form.Item
                      label="Preço"
                      name="price"
                    >
                      <Slider 
                        range 
                        marks={{ 0: '0', 100: '100' }} 
                        defaultValue={[20, 50]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Pesquisar
                    </Button>
                    <Button htmlType="reset">
                      Limpar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Formulário dinâmico */}
          <Col xs={24}>
            <Card title="Formulário Dinâmico (Lista de Módulos)" className={styles.demoCard}>
              <Form
                name="dynamic_form"
                autoComplete="off"
                initialValues={{ modules: [{ name: '', description: '' }] }}
              >
                <Form.List name="modules">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={16} align="middle" style={{ marginBottom: 16 }}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              rules={[{ required: true, message: 'Nome do módulo é obrigatório' }]}
                            >
                              <Input placeholder="Nome do módulo" />
                            </Form.Item>
                          </Col>
                          
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              rules={[{ required: true, message: 'Descrição é obrigatória' }]}
                            >
                              <Input placeholder="Descrição do módulo" />
                            </Form.Item>
                          </Col>
                          
                          <Col span={4}>
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />} 
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      ))}
                      
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                        >
                          Adicionar Módulo
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Salvar Curso
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left" style={{ margin: '40px 0 24px' }}>Exemplos de Listas</Divider>
        
        <Row gutter={[24, 24]}>
          {/* Lista básica */}
          <Col xs={24} lg={12}>
            <Card title="Lista Básica" className={styles.demoCard}>
              <List
                bordered
                dataSource={[
                  'Introdução à Programação',
                  'Algoritmos e Estruturas de Dados',
                  'Desenvolvimento Web Frontend',
                  'Banco de Dados',
                  'Desenvolvimento Backend'
                ]}
                renderItem={(item) => (
                  <List.Item>
                    {item}
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Lista com avatar e descrição */}
          <Col xs={24} lg={12}>
            <Card title="Lista com Avatar e Descrição" className={styles.demoCard}>
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'Python para Iniciantes',
                    description: 'Curso básico de Python com foco em fundamentos',
                    avatar: 'https://via.placeholder.com/40x40',
                    status: 'Ativo'
                  },
                  {
                    title: 'JavaScript Avançado',
                    description: 'Aprenda conceitos avançados de JavaScript e ES6+',
                    avatar: 'https://via.placeholder.com/40x40',
                    status: 'Ativo'
                  },
                  {
                    title: 'React & Redux',
                    description: 'Desenvolvimento de aplicações web com React',
                    avatar: 'https://via.placeholder.com/40x40',
                    status: 'Em breve'
                  },
                  {
                    title: 'Ciência de Dados',
                    description: 'Análise de dados, visualização e machine learning',
                    avatar: 'https://via.placeholder.com/40x40',
                    status: 'Em preparação'
                  }
                ]}
                renderItem={(item) => (
                  <List.Item actions={[
                    <Button key="edit" type="link" icon={<EditOutlined />}>Editar</Button>,
                    <Button key="more" type="link" icon={<EllipsisOutlined />}>Mais</Button>
                  ]}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a href="#">{item.title}</a>}
                      description={item.description}
                    />
                    <Tag color={item.status === 'Ativo' ? 'var(--success-color)' : 
                           item.status === 'Em breve' ? 'var(--warning-color)' : 'var(--primary-color)'}>
                      {item.status}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Lista com cards */}
          <Col xs={24} lg={12}>
            <Card title="Lista de Cards (Grid)" className={styles.demoCard}>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
                dataSource={[
                  {
                    title: 'Marketing Digital',
                    content: 'Estratégias para redes sociais'
                  },
                  {
                    title: 'Design UX/UI',
                    content: 'Princípios de design de interfaces'
                  },
                  {
                    title: 'SEO Avançado',
                    content: 'Otimização para mecanismos de busca'
                  },
                  {
                    title: 'Email Marketing',
                    content: 'Campanhas efetivas de email'
                  }
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Card hoverable title={item.title}>
                      {item.content}
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Lista com carregamento e paginação */}
          <Col xs={24} lg={12}>
            <Card title="Lista com Carregamento e Paginação" className={styles.demoCard}>
              <List
                loading={loading}
                itemLayout="vertical"
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 3,
                  total: 9,
                  showTotal: (total) => `Total de ${total} itens`
                }}
                dataSource={[
                  {
                    title: 'Gestão de Projetos',
                    description: 'Metodologias ágeis e ferramentas',
                    content: 'Aprenda a gerenciar projetos com metodologias ágeis como Scrum e Kanban. Conheça ferramentas populares e boas práticas.',
                    avatar: 'https://via.placeholder.com/40x40'
                  },
                  {
                    title: 'Liderança e Gestão de Equipes',
                    description: 'Habilidades de liderança para gestores',
                    content: 'Desenvolva habilidades essenciais para liderar equipes de forma eficaz. Comunicação, feedback, resolução de conflitos e mais.',
                    avatar: 'https://via.placeholder.com/40x40'
                  },
                  {
                    title: 'Produtividade Pessoal',
                    description: 'Técnicas para otimizar seu tempo',
                    content: 'Metodologias como GTD, Pomodoro e ferramentas digitais para organização. Aumente sua produtividade e reduza o estresse.',
                    avatar: 'https://via.placeholder.com/40x40'
                  }
                ]}
                renderItem={(item) => (
                  <List.Item
                    key={item.title}
                    extra={
                      <Image
                        width={200}
                        alt="thumbnail"
                        src="https://via.placeholder.com/200x120"
                      />
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a href="#">{item.title}</a>}
                      description={item.description}
                    />
                    {item.content}
                  </List.Item>
                )}
              />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Switch checked={loading} onChange={toggleLoading} />
                <span style={{ marginLeft: 8 }}>Alternar carregamento</span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}