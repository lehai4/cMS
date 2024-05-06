import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import InfiniteScroll from "@/components/InfiniteScroller";
import TableList from "@/components/TableList";
import { useAppDispatch, useAppSelector } from "@/hook/useHookRedux";
import { getAllPurchase } from "@/redux/api";
import { DataTypePurchase } from "@/type";
import { DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Popconfirm,
  PopconfirmProps,
  Space,
  TableColumnsType,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

const PurChase = () => {
  const dispath = useAppDispatch();
  const user = useAppSelector((state) => state.auth.login.currentUser);

  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);

  const [idDelete, setIdDelete] = useState<string>("");
  const [purchase, setPurchase] = useState<DataTypePurchase[]>([]);
  const [isHasMore, setIsHasMore] = useState<boolean>(true);

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    try {
      await AxiosJWTInstance({ user, dispath })({
        method: "DELETE",
        url: `/purchase/${idDelete}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const purchase = await getAllPurchase({ user, dispath });
      setPurchase(purchase);
      toast.success("Delete purchase successfully!");
    } catch (e) {
      toast.error("Delete purchase failed!");
    }
  };

  const cancel: PopconfirmProps["onCancel"] = () => {
    message.error("No Delete");
  };

  const columns: TableColumnsType<DataTypePurchase> = [
    {
      title: "Id",
      dataIndex: "id",
      render: (id: string) => (
        <Typography.Text className="text-[16px]">{id}</Typography.Text>
      ),
    },
    {
      title: "UserId",
      dataIndex: "userId",
      render: (userId: string) => (
        <Typography.Text className="text-[16px]">{userId}</Typography.Text>
      ),
    },
    {
      title: "ProductId",
      dataIndex: "productId",
      render: (productId: string) => (
        <Typography.Text className="text-[16px]">{productId}</Typography.Text>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: string) => (
        <Typography.Text className="text-[16px]">{amount}</Typography.Text>
      ),
    },
    {
      title: "TotalPrice",
      dataIndex: "totalPrice",
      render: (totalPrice: string) => (
        <Typography.Text className="text-[16px]">{totalPrice}</Typography.Text>
      ),
    },
    {
      title: "ReviewNote",
      dataIndex: "reviewNote",
      render: (reviewNote: string) => (
        <Typography.Text className="text-[16px]">
          {reviewNote !== null ? reviewNote : "No review"}
        </Typography.Text>
      ),
    },
    {
      title: "ReviewComment",
      dataIndex: "reviewComment",
      render: (reviewComment: string) => (
        <Typography.Text className="text-[16px]">
          {reviewComment !== null ? reviewComment : "No Comment"}
        </Typography.Text>
      ),
    },
    {
      title: "Date Create",
      dataIndex: "createdAt",
      render: (createdAt: string) => (
        <Typography.Text className="text-[16px]">{createdAt}</Typography.Text>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      render: (user: { email: string }) => (
        <Typography.Text className="text-[16px]">{user.email}</Typography.Text>
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (product: { name: string }) => (
        <Typography.Text className="text-[16px]">
          {product.name}
        </Typography.Text>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      fixed: "right",
      render: (e: DataTypePurchase) => (
        <Space className="gap-4">
          <Link to={`/purchase/${e.id}`}>
            <Button type="primary" icon={<EnvironmentOutlined />} size="large">
              Review
            </Button>
          </Link>
          <Popconfirm
            title="Delete"
            description={`You are sure delete "${e.id}" ?`}
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            style={{ width: 550 }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIdDelete(e.id)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource: any[] = purchase?.map((t) => {
    return {
      key: t.id,
      id: t.id,
      userId: t.userId,
      productId: t.productId,
      amount: t.amount,
      totalPrice: t.totalPrice,
      reviewNote: t.reviewNote,
      reviewComment: t.reviewComment,
      createdAt: t.createdAt,
      user: t.user,
      product: t.product,
    };
  });
  const handleChangeInputSearch = useDebouncedCallback(async () => {
    toast.info("function is not working");
  }, 1000);

  useEffect(() => {
    (async () => {
      await AxiosJWTInstance({ user, dispath })({
        method: "GET",
        url: `/purchase/admin?page=${page}&offset=10`,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          response.data.length === 0
            ? setIsHasMore(false)
            : setPurchase([...purchase, ...response.data]);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  }, [page]);

  return (
    <>
      <Helmet title="Category-list">
        <></>
      </Helmet>
      <div className="py-[20px] px-[30px]">
        <h1 className="text-[32px] font-semibold">Purchase List</h1>
        <Space direction="horizontal" className="py-[20px] flex flex-row gap-5">
          <Space className="gap-5">
            <form method="get" action="/purchase">
              <Input.Search
                className="flex py-[20px]"
                placeholder="Search purchase..."
                size="large"
                type="search"
                name="purchaseName"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  e.preventDefault();
                  handleChangeInputSearch();
                }}
              />
            </form>
            <Link to="create">
              <Button type="primary" className="bg-blue-500" size="large">
                Create Purchase
              </Button>
            </Link>
          </Space>
        </Space>
        <div className="py-[25px]">
          <InfiniteScroll
            loader={<p className="text-[16px]">Loading...</p>}
            fetchMore={() => setPage((prev) => prev + 1)}
            hasMore={isHasMore}
            endMessage={<p>You have seen it all</p>}
          >
            <TableList columns={columns} dataSource={dataSource} />
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default PurChase;
