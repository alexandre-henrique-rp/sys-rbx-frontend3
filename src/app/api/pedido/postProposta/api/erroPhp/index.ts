import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const ErroPHP = async (ERROR: any) => {
  const token: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;
  const Session = await getServerSession(nextAuthOptions);
  const EmailUser: any = Session?.user.email;

  const BodyData = {
    data: {
      ...ERROR,
    },
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RIBERMAX_PHP}/erro-phps`, {
      method: 'POST',
      headers: {
        Token: token,
        Email: EmailUser,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BodyData),
    });

    const data = await response.json();
    console.log("post Erro PHP",data);
    const msg = ERROR.log.error.message + " lote " + ERROR.log.nLote;
    return msg;
  } catch (err: any) {
    return err.response.data;
  }
};
